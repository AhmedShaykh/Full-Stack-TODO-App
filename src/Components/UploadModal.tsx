"use client";
import React, { useState } from "react";
import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";
import { useUser } from "@/Hooks/useUser";
import useUploadModal from "@/Hooks/useUploadModal";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import uniqid from "uniqid";

const UploadModal = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const supabaseClient = useSupabaseClient();

    const uploadModal = useUploadModal();

    const { user } = useUser();

    const router = useRouter();


    const {
        register,
        handleSubmit,
        reset
    } = useForm<FieldValues>({
        defaultValues: {
            artist: "",
            title: "",
            song: null,
            image: null,
        }
    });

    const onChange = (open: boolean) => {

        if (!open) {

            reset();

            uploadModal.onClose();
        }

    };

    const onSubmit: SubmitHandler<FieldValues> = async (values) => {

        try {

            setIsLoading(true);

            const imageFile = values.image?.[0];

            const songFile = values.song?.[0];

            if (!imageFile || !songFile || !user) {

                toast.error("Missing Fields");

                return;
            }

            const uniqueID = uniqid();

            const {
                data: songData,
                error: songError
            } = await supabaseClient
                .storage
                .from("songs")
                .upload(`song-${values.title}-${uniqueID}`, songFile, {
                    cacheControl: "3600",
                    upsert: false
                });

            if (songError) {

                setIsLoading(false);

                return toast.error("Failed Song Upload");
            }

            const {
                data: imageData,
                error: imageError
            } = await supabaseClient
                .storage
                .from("images")
                .upload(`image-${values.title}-${uniqueID}`, imageFile, {
                    cacheControl: "3600",
                    upsert: false
                });

            if (imageError) {

                setIsLoading(false);

                return toast.error("Failed Image Upload");
            }

            const { error: supabaseError } = await supabaseClient
                .from("songs")
                .insert({
                    user_id: user.id,
                    title: values.title,
                    author: values.author,
                    image_path: imageData.path,
                    song_path: songData.path
                });

            if (supabaseError) {
                return toast.error(supabaseError.message);
            }

            router.refresh();

            setIsLoading(false);

            toast.success("Track Upload!");

            reset();

            uploadModal.onClose();

        } catch (error) {

            toast.error("Something Went Wrong");

        } finally {

            setIsLoading(false);

        }
    };

    return (
        <Modal
            title="Add A Song"
            description="Upload An MP3 File"
            isOpen={uploadModal.isOpen}
            onChange={onChange}
        >
            <form
                className="flex flex-col gap-y-4"
                onSubmit={handleSubmit(onSubmit)}
            >
                <Input
                    id="title"
                    disabled={isLoading}
                    {...register("title", { required: true })}
                    placeholder="Song Name"
                />
                <Input
                    id="artist"
                    disabled={isLoading}
                    {...register("artist", { required: true })}
                    placeholder="Artist Name"
                />
                <div>
                    <div className="pb-1">
                        Upload Song
                    </div>
                    <Input
                        placeholder="Upload File"
                        disabled={isLoading}
                        type="file"
                        accept=".mp3"
                        id="song"
                        {...register("song", { required: true })}
                    />
                </div>
                <div>
                    <div className="pb-1">
                        Upload Song Image
                    </div>
                    <Input
                        placeholder="Upload File Image"
                        disabled={isLoading}
                        type="file"
                        accept="image/*"
                        id="image"
                        {...register("image", { required: true })}
                    />
                </div>
                <Button disabled={isLoading} type="submit">
                    Create
                </Button>
            </form>
        </Modal>
    )
};

export default UploadModal;