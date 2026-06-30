"use client";

import { useEffect, useState } from "react";
import { User } from "@/types";
import { fetchUser, modifyUser, resetPassword } from "@/app/actions/UserController";
import { MdOutlinePerson, MdOutlineMail, MdOutlinePhone, MdPassword } from "react-icons/md";
import Input from "../input";
import Toggle from "../toggleComponents";
import Button from "../Button";

interface Props {
    userId: string;
    setActiveSection: (s: string) => void;
}

export default function EditUser({ userId, setActiveSection }: Props) {
    const [user, setUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({ email: "", contactNumber: "", newPassword: "" });
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadUser() {
            const data = await fetchUser(userId);
            if (data) {
                setUser(data);
                setFormData({ email: data.email || "", contactNumber: data.contact_number || "", newPassword: "" });
                setTwoFactorEnabled(data.two_factor_enabled || false);
            }
            setLoading(false);
        }
        loadUser();
    }, [userId]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            await modifyUser(userId, {
                email: formData.email,
                contact_number: formData.contactNumber,
                two_factor_enabled: twoFactorEnabled
            });

            if (formData.newPassword) {
                await resetPassword(userId, formData.newPassword);
            }

            setActiveSection("user-details");
        } catch (err) {
            console.error("Error saving user:", err);
            setError("Failed to save changes.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="flex items-center justify-center h-full"><p className="text-gray-400">Loading...</p></div>;

    return (
        <div className="p-6 h-full w-full max-w-lg mx-auto flex flex-col gap-4">
            <header className="flex justify-between items-start">
                <button onClick={() => setActiveSection("user-details")} className="flex gap-2 cursor-pointer">
                    <span className="text-lg items-center">←</span>
                    <div>
                        <p className="font-bold text-sm text-left">Back</p>
                        <p className="text-xs text-gray-500">Edit {user?.name}'s Profile</p>
                    </div>
                </button>
            </header>

            <div className="bg-background/20 z-50 backdrop-blur-md rounded-2xl px-4 py-4 flex items-center gap-3 shadow-md">
                <div className="w-12 h-12 rounded-full bg-gray-400 flex-shrink-0 flex items-center justify-center">
                    <MdOutlinePerson size={24} className="text-white" />
                </div>
                <div>
                    <p className="font-bold">{user?.name?.toUpperCase()}</p>
                    <p className="text-sm text-gray-500">{user?.role}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <h2 className="font-bold mb-2">Personal Information</h2>
                    <div className="bg-secondary/20 z-50 backdrop-blur-md rounded-2xl px-4 py-4 flex flex-col gap-4 shadow-md">
                        <div className="flex flex-row gap-4 items-center w-full">
                            <MdOutlineMail className="text-4xl p-1 w-10" />
                            <Input label="Staff Email" type="email" placeholder="Staff Email" required
                                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                        </div>
                        <div className="flex flex-row gap-4 items-center w-full">
                            <MdOutlinePhone className="text-4xl p-1 w-10" />
                            <Input label="Staff Phone Line" type="text" placeholder="Staff Phone Line"
                                value={formData.contactNumber} onChange={e => setFormData({...formData, contactNumber: e.target.value})} />
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="font-bold mb-2">Security</h2>
                    <div className="bg-secondary/20 z-50 backdrop-blur-md rounded-2xl px-4 py-4 flex flex-col gap-4 shadow-md">
                        <div className="flex flex-row gap-4 items-center w-full">
                            <MdPassword className="text-4xl text-white bg-foreground p-1 rounded-xl w-10" />
                            <Input label="New Password (leave blank to keep)" type="password" placeholder="New Password"
                                value={formData.newPassword} onChange={e => setFormData({...formData, newPassword: e.target.value})} />
                        </div>
                        <div className="flex flex-row gap-4 items-center w-full">
                            <div className="relative w-fit flex-shrink-0">
                                <MdOutlineMail className="text-5xl text-foreground" />
                                <MdPassword className="absolute top-0 right-0 w-7 bg-black rounded text-white p-0.5 translate-x-1 -translate-y-1" />
                            </div>
                            <Toggle label="Two Factor Authentication" initial={twoFactorEnabled} onToggle={setTwoFactorEnabled} activeText="Enabled" inactiveText="Disabled" />
                        </div>
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <div className="flex flex-row gap-4 w-full justify-center">
                    <Button type="reset" buttonText="Discard Changes" className="flex-1 !rounded-full !py-3 !text-sm !bg-red-400 !text-white hover:!bg-red-500" onClick={() => setActiveSection("user-details")} />
                    <Button type="submit" buttonText={saving ? "Saving..." : "Save Changes"} className="flex-1 !rounded-full !py-3 !text-sm" disabled={saving} />
                </div>
            </form>
        </div>
    );
}
