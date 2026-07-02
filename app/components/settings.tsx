"use client";

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import BackButton from "./BackButton";
import Button from "./Button";
import { User } from "@/types";
import { MdClose, MdOutlinePerson } from "react-icons/md";

interface SettingsProps {
    handleNavClick: (newSection: string) => void; // Optional prop for navigation
    entryPoint: string; // The section to return to when leaving settings
}

export default function SettingsPage({ handleNavClick, entryPoint }: SettingsProps) {
    const { data: session } = useSession();
    const user: User | undefined = session?.user as User;
    const [showFeedback, setShowFeedback] = useState(false);

    if (showFeedback) {
        return (
            <div className="p-6 h-screen w-full max-w-lg max-h-screen mx-auto flex flex-col overflow-y-hidden">
                <header className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Submit Feedback</h2>
                    <button onClick={() => setShowFeedback(false)} className="p-2 rounded-full hover:bg-gray-200">
                        <MdClose size={24} />
                    </button>
                </header>
                <div className="flex-1 w-full h-full border rounded-xl overflow-hidden">
                    <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSedqwUfRxrDt9VHsNeJ0tVPNzi1BEubTwPForzx51Ajnz2k4g/viewform?embedded=true" width="100%" height="100%">Loading…</iframe>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 h-screen w-full max-w-lg max-h-screen mx-auto flex flex-col overflow-y-hidden">
            <header>
                <BackButton buttonName="Back" buttonDesc="Settings" onClick={() => handleNavClick(entryPoint)} />
            </header>

            <main className="flex-1 flex flex-col items-center gap-8 pb-32 mt-4">

                <div className="bg-background/20 z-50 backdrop-blur-md rounded-2xl px-4 py-4 w-full flex items-center gap-3 shadow-md">
                    <div className="w-12 h-12 rounded-full bg-gray-400 flex-shrink-0 flex items-center justify-center">
                        <MdOutlinePerson size={24} className="text-white" />
                    </div>
                    <div>
                        <p className="font-bold">{user?.name?.toUpperCase()}</p>
                        <p className="text-sm text-gray-500">{user?.role}</p>
                    </div>
                </div>

                <div className="bg-background/20 z-50 backdrop-blur-md rounded-2xl px-4 py-2 w-full flex flex-col items-center gap-3 shadow-md">
                    <div className="py-4 w-full max-w-lg cursor-pointer flex justify-between" onClick={() => handleNavClick('edit-profile')}>
                        <span>Edit Profile</span>
                        <span className="font-bold">→</span>
                    </div>
                    <div className="w-full h-[0.5px] max-w-lg bg-black" />
                    <div className="py-4 w-full max-w-lg cursor-pointer flex justify-between" onClick={() => setShowFeedback(true)}>
                        <span>Submit Feedbacks</span>
                        <span className="font-bold">→</span>
                    </div>
                </div>

                <Button className="!w-fit !h-10" buttonText="Sign Out" onClick={() => signOut({ redirectTo: '/login' })} />
            </main>
        </div>
    )
}