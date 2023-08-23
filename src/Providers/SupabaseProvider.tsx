"use client";
import { FC, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

interface SupabaseProviderProps {
    children: React.ReactNode;
};

const SupabaseProvider: FC<SupabaseProviderProps> = ({ children }) => {

    const [supabaseClient] = useState(() =>
        createClientComponentClient<any>()
    );

    return (
        <SessionContextProvider supabaseClient={supabaseClient}>
            {children}
        </SessionContextProvider>
    )
};

export default SupabaseProvider;