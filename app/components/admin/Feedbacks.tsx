"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { getAllFeedbacks } from "@/app/actions/UserController";
import { useUser } from "@/app/components/UserBoundary/UserContext";
import { MdOutlinePerson, MdChevronRight } from "react-icons/md";
import Button from "../Button";

interface Feedback {
    id: string;
    comments?: string;
    message?: string;
}

export default function Feedbacks() {
    const router = useRouter();
    const { user: adminUser, isLoading } = useUser();
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [fetching, setFetching] = useState(true);

    // useEffect(() => {
    //     async function fetchFeedbacks() {
    //         const data = await getAllFeedbacks();
    //         setFeedbacks(data as Feedback[]);
    //         setFetching(false);
    //     }
    //     fetchFeedbacks();
    // }, []);

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
                <Button buttonText="🚪" className="!w-10 !h-10" onClick={() => router.push("/login")} />
            </header>

            <div className="flex flex-col gap-3">
                {fetching ? (
                    <p className="text-center text-gray-400 mt-10">Loading feedbacks...</p>
                ) : feedbacks.length === 0 ? (
                    <p className="text-center text-gray-400 mt-10">No feedbacks yet.</p>
                ) : feedbacks.map((fb, i) => (
                    <div key={fb.id} className="flex items-center bg-background/20 z-50 backdrop-blur-md rounded-2xl px-4 py-4 gap-3 shadow-md cursor-pointer hover:bg-background/30 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-gray-400 flex-shrink-0 flex items-center justify-center">
                            <MdOutlinePerson size={20} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-sm">Report #{String(i + 1).padStart(3, "0")}</p>
                            <p className="text-xs text-gray-500 line-clamp-2">{fb.comments || fb.message || "No description"}</p>
                        </div>
                        <div className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center flex-shrink-0">
                            <MdChevronRight size={18} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
