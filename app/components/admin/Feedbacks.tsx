"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/components/UserBoundary/UserContext";
import { fetchFeedbacks } from "@/app/actions/FeedbackController";
import { MdOutlinePerson } from "react-icons/md";
import Button from "../Button";

interface Feedback {
    setActiveSection: (section: string) => void;
    id: number;
    timestamp: string;
    name: string;
    studentId: string;
    rating: string;
    feature: string;
    comments: string;
}

export default function Feedbacks({ setActiveSection }: { setActiveSection: (section: string) => void }) {
    const router = useRouter();
    const { user: adminUser, isLoading } = useUser();
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        async function loadFeedbacks() {
            const data = await fetchFeedbacks();
            setFeedbacks(data);
            setFetching(false);
        }
        loadFeedbacks();
    }, []);

    function getGreeting() {
        const h = new Date().getHours();
        if (h < 12) return "Good Morning";
        if (h < 18) return "Good Afternoon";
        return "Good Evening";
    }

    return (
        <div className="p-6 h-full w-full max-w-lg mx-auto flex flex-col gap-4">
            <header className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold">
                        {isLoading ? "Loading..." : `${getGreeting()}, ${adminUser?.name?.split(" ")[0] || "Admin"}!`}
                    </h1>
                    <p className="text-sm text-gray-600">Feedbacks</p>
                </div>
                <Button buttonText="⚙️" className="!w-10 !h-10" onClick={() => setActiveSection("settings")} />
            </header>

            <div className="flex flex-col gap-3">
                {fetching ? (
                    <p className="text-center text-gray-400 mt-10">Loading feedbacks...</p>
                ) : feedbacks.length === 0 ? (
                    <p className="text-center text-gray-400 mt-10">No feedbacks yet.</p>
                ) : feedbacks.map((fb) => (
                    <div key={fb.id} className="bg-background/20 z-50 backdrop-blur-md rounded-2xl px-4 py-4 flex flex-col gap-2 shadow-md">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-400 flex-shrink-0 flex items-center justify-center">
                                <MdOutlinePerson size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="font-bold text-sm">{fb.name}</p>
                                <p className="text-xs text-gray-500">{fb.studentId}</p>
                            </div>
                            <div className="ml-auto text-sm font-bold">⭐ {fb.rating}/5</div>
                        </div>
                        <p className="text-xs text-gray-500">{fb.feature}</p>
                        {fb.comments && <p className="text-sm">{fb.comments}</p>}
                        <p className="text-xs text-gray-400">{fb.timestamp}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
