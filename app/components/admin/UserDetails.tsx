"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types";
import { fetchUser, deleteUser } from "@/app/actions/UserController";
import { MdOutlinePerson, MdOutlineMail, MdOutlinePhone, MdPassword } from "react-icons/md";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Button from "../Button";

interface Props {
    userId: string;
    setActiveSection: (s: string) => void;
}

export default function UserDetails({ userId, setActiveSection }: Props) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getUser() {
            const data = await fetchUser(userId);
            setUser(data);
            setLoading(false);
        }
        getUser();
    }, [userId]);

    async function handleDelete() {
        if (!confirm("Delete this account?")) return;
        const res = await deleteUser(userId);
        if (res.success) setActiveSection("manage-users");
    }

    if (loading) return <div className="flex items-center justify-center h-full"><p className="text-gray-400">Loading...</p></div>;
    if (!user) return <div className="flex items-center justify-center h-full"><p className="text-gray-400">User not found.</p></div>;

    return (
        <div className="p-6 h-full w-full max-w-lg mx-auto flex flex-col gap-4">
            <header className="flex justify-between items-start">
                <button onClick={() => setActiveSection("manage-users")} className="flex gap-2 cursor-pointer">
                    <span className="text-lg items-center">←</span>
                    <div>
                        <p className="font-bold text-sm text-left">Back</p>
                        <p className="text-xs text-gray-500">User List</p>
                    </div>
                </button>
                <Button buttonText="🚪" className="!w-10 !h-10" onClick={() => router.push("/login")} />
            </header>

            <div className="bg-background/20 z-50 backdrop-blur-md rounded-2xl px-4 py-4 flex items-center gap-3 shadow-md">
                <div className="w-12 h-12 rounded-full bg-gray-400 flex-shrink-0 flex items-center justify-center">
                    <MdOutlinePerson size={24} className="text-white" />
                </div>
                <div>
                    <p className="font-bold">{user.name?.toUpperCase()}</p>
                    <p className="text-sm text-gray-500">{user.role}</p>
                </div>
            </div>

            <div>
                <h2 className="font-bold mb-2">Personal Information</h2>
                <div className="bg-secondary/20 z-50 backdrop-blur-md rounded-2xl px-4 py-4 flex flex-col gap-4 shadow-md">
                    <div className="flex items-center gap-3">
                        <MdOutlineMail className="text-4xl p-1 w-10" />
                        <div>
                            <p className="font-semibold text-sm">{user.email}</p>
                            <p className="text-xs text-gray-500">Campus Email</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <MdOutlinePhone className="text-4xl p-1 w-10" />
                        <div>
                            <p className="font-semibold text-sm">{user.contact_number || "N/A"}</p>
                            <p className="text-xs text-gray-500">Campus Phone Line</p>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="font-bold mb-2">Security</h2>
                <div className="bg-secondary/20 z-50 backdrop-blur-md rounded-2xl px-4 py-4 flex flex-col gap-4 shadow-md">
                    <div className="flex items-center gap-3">
                        <MdPassword className="text-4xl text-white bg-foreground p-1 rounded-xl w-10" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm break-all">{showPassword ? (user.password || "N/A") : "•".repeat(14)}</p>
                            <p className="text-xs text-gray-500">Password</p>
                        </div>
                        <button onClick={() => setShowPassword(!showPassword)} className="cursor-pointer">
                            {showPassword ? <FiEyeOff size={18} className="text-gray-500" /> : <FiEye size={18} className="text-gray-500" />}
                        </button>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative w-fit flex-shrink-0">
                            <MdOutlineMail className="text-5xl text-foreground" />
                            <MdPassword className="absolute top-0 right-0 w-7 bg-black rounded text-white p-0.5 translate-x-1 -translate-y-1" />
                        </div>
                        <div>
                            <p className="font-semibold text-sm">{user.two_factor_enabled ? "Enabled" : "Disabled"}</p>
                            <p className="text-xs text-gray-500">2FA Status</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 mt-2">
                <Button buttonText="Edit Profile" className="flex-1 !rounded-full !py-3 !text-sm" onClick={() => setActiveSection("edit-user")} />
                <button onClick={handleDelete} className="flex-1 py-3 bg-red-400 text-white rounded-full font-bold text-sm cursor-pointer hover:bg-red-500 transition-colors">
                    Delete Account
                </button>
            </div>
        </div>
    );
}
