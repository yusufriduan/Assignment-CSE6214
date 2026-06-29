"use client";

import { signOut, useSession } from "next-auth/react";
import BackButton from "./BackButton";
import Button from "./Button";
import { User } from "@/types";
import { MdOutlinePerson } from "react-icons/md";

interface SettingsProps {
    setActiveSection: (section: string) => void;
}

export default function SettingsPage({ setActiveSection }: SettingsProps) {
    const { data: session } = useSession();
    const user: User | undefined = session?.user as User;
    return (
        <div className="p-6 h-full w-full max-w-lg max-h-screen mx-auto">
            <header>
                <BackButton buttonName="Back" buttonDesc="Settings"/>
            </header>

            <main className="flex-1 flex flex-col items-center gap-2 overflow-y-auto pb-32">

                <div className="bg-background/20 z-50 backdrop-blur-md rounded-2xl px-4 py-4 w-full flex items-center gap-3 shadow-md">
                    <div className="w-12 h-12 rounded-full bg-gray-400 flex-shrink-0 flex items-center justify-center">
                        <MdOutlinePerson size={24} className="text-white" />
                    </div>
                    <div>
                        <p className="font-bold">{user?.name?.toUpperCase()}</p>
                        <p className="text-sm text-gray-500">{user?.role}</p>
                    </div>
                </div>

                <div className="py-4 w-full max-w-lg cursor-pointer flex justify-between" onClick={() => setActiveSection('edit-profile')}>
                    <span>Edit Profile</span>
                    <span className="font-bold">→</span>
                </div>
                <div className="w-full h-[0.5px] max-w-lg bg-black" />
                <div className="py-4 w-full max-w-lg cursor-pointer flex justify-between">
                    <span>Submit Feedbacks</span>
                    <span className="font-bold">→</span>
                </div>
                <div className="w-full h-[0.5px] max-w-lg bg-black" />

                <Button className="!w-fit !h-10" buttonText="Sign Out" onClick={() => signOut({ redirectTo: '/login' })} />
            </main>
        </div>
    )
}