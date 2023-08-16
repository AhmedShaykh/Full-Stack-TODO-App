"use client";
import React, { FC } from "react";
import useAuthModal from "@/Hooks/useAuthModal";
import useUploadModal from "@/Hooks/useUploadModal";
import { useUser } from "@/Hooks/useUser";
import { TbPlaylist } from "react-icons/tb";
import { AiOutlinePlus } from "react-icons/ai";

const Library: FC = () => {

    const { user, subscription } = useUser();

    const uploadModal = useUploadModal();

    const authModal = useAuthModal();

    const onClick = () => {

        if (!user) {
            return authModal.onOpen();
        }

        // if (!subscription) {
        //     return subscribeModal.onOpen();
        // }

        return uploadModal.onOpen();
    };

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between px-5 pt-4">
                <div className="inline-flex items-center gap-x-2">
                    <TbPlaylist className="text-neutral-400" size={26} />
                    <p className="text-neutral-400 font-semibold text-md">
                        Your Library
                    </p>
                </div>
                <AiOutlinePlus
                    className="text-neutral-400 cursor-pointer hover:text-white transition"
                    onClick={onClick}
                    size={20}
                />
            </div>
            <div className="flex flex-col gap-y-2 mt-4 px-3">
                Songs Lists
            </div>
        </div>
    )
};

export default Library;