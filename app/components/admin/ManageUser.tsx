"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types";
import { fetchAllUsers, deleteUser } from "@/app/actions/UserController";
import { useUser } from "@/app/components/UserBoundary/UserContext";
import { MdOutlinePerson } from "react-icons/md";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import Button from "../Button";

const TABS = ["All", "Student", "Campus Staff", "Resource Manager"];

interface Props {
    setActiveSection: (s: string) => void;
    setSelectedUserId: (id: string) => void;
}

export default function ManageUser({ setActiveSection, setSelectedUserId }: Props) {
    const router = useRouter();
    const { user: adminUser, isLoading } = useUser();
    const [users, setUsers] = useState<User[]>([]);
    const [filtered, setFiltered] = useState<User[]>([]);
    const [activeTab, setActiveTab] = useState("All");
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        async function fetchUsers() {
            const data = await fetchAllUsers();
            setUsers(data);
            setFiltered(data);
            setFetching(false);
        }
        fetchUsers();
    }, []);

    function filterByTab(tab: string) {
        setActiveTab(tab);
        setFiltered(tab === "All" ? users : users.filter(u => u.role === tab));
    }

    async function handleDelete(user_id: string) {
        if (!confirm("Delete this user?")) return;
        const res = await deleteUser(user_id);
        if (res.success) {
            const updated = users.filter(u => u.user_id !== user_id);
            setUsers(updated);
            setFiltered(activeTab === "All" ? updated : updated.filter(u => u.role === activeTab));
        }
    }

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
                    <p className="text-sm text-gray-600">Manage User</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button buttonText="+ Add User" className="!text-sm !py-2 !px-4 !rounded-full !h-fit" onClick={() => setActiveSection("register-staff")} />
                    <Button buttonText="⚙️" className="!w-10 !h-10" onClick={() => setActiveSection("settings")} />
                </div>
            </header>

            <div className="flex gap-2 overflow-x-auto pb-1">
                {TABS.map(tab => (
                    <button key={tab} onClick={() => filterByTab(tab)}
                        className={`whitespace-nowrap text-sm px-4 py-1.5 rounded-full border transition-all cursor-pointer ${activeTab === tab ? "bg-black text-white border-black" : "bg-white text-black border-gray-300"}`}>
                        {tab}
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-3">
                {fetching ? (
                    <p className="text-center text-gray-400 mt-10">Loading users...</p>
                ) : filtered.length === 0 ? (
                    <p className="text-center text-gray-400 mt-10">No users found.</p>
                ) : filtered.map(user => (
                    <div key={user.user_id} className="flex items-center bg-background/20 z-50 backdrop-blur-md rounded-2xl px-4 py-3 gap-3 shadow-md">
                        <div className="w-10 h-10 rounded-full bg-gray-400 flex-shrink-0 flex items-center justify-center">
                            <MdOutlinePerson size={20} className="text-white" />
                        </div>
                        <div className="flex-1 cursor-pointer" onClick={() => { setSelectedUserId(user.user_id); setActiveSection("user-details"); }}>
                            <p className="font-bold text-sm">{user.name?.toUpperCase()}</p>
                            <p className="text-xs text-gray-500">{user.role}</p>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <button className="cursor-pointer" onClick={() => { setSelectedUserId(user.user_id); setActiveSection("edit-user"); }}>
                                <FiEdit2 size={18} className="text-gray-600" />
                            </button>
                            <button className="cursor-pointer" onClick={() => handleDelete(user.user_id)}>
                                <RiDeleteBin6Line size={18} className="text-red-500" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
