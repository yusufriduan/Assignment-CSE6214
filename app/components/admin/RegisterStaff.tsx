"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerStaff } from "@/app/actions/UserController";
import Input from "../input";
import Button from "../Button";

interface Props {
    setActiveSection: (s: string) => void;
}

const ROLES = ["Campus Staff", "Resource Manager", "Admin"] as const;
type StaffRole = typeof ROLES[number];

export default function RegisterStaff({ setActiveSection }: Props) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        user_id: "", name: "", email: "", password: "",
        contact_number: "", department: ""
    });
    const [role, setRole] = useState<StaffRole>("Campus Staff");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError("");

        const res = await registerStaff({ ...formData, role });
        if (res.success) {
            setActiveSection("manage-users");
        } else {
            setError(res.message || "Registration failed");
            setSaving(false);
        }
    }

    return (
        <div className="p-6 h-full w-full max-w-lg mx-auto flex flex-col gap-4">
            <header className="flex justify-between items-start">
                <button onClick={() => setActiveSection("manage-users")} className="flex gap-2 cursor-pointer">
                    <span className="text-lg items-center">←</span>
                    <div>
                        <p className="font-bold text-sm text-left">Back</p>
                        <p className="text-xs text-gray-500">Register Staff</p>
                    </div>
                </button>
                <Button buttonText="🚪" className="!w-10 !h-10" onClick={() => router.push("/login")} />
            </header>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="bg-secondary/20 z-50 backdrop-blur-md rounded-2xl px-4 py-4 flex flex-col gap-4 shadow-md">
                    <Input label="Staff ID" type="text" placeholder="e.g. 251UC2515C" required
                        value={formData.user_id} onChange={e => setFormData({...formData, user_id: e.target.value})} />
                    <Input label="Full Name" type="text" placeholder="Full Name" required
                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    <Input label="Email" type="email" placeholder="Staff Email" required
                        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    <Input label="Password" type="password" placeholder="Password" required
                        value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                    <Input label="Phone Number" type="text" placeholder="e.g. +60312345678"
                        value={formData.contact_number} onChange={e => setFormData({...formData, contact_number: e.target.value})} />
                    <Input label="Department" type="text" placeholder="e.g. FCI" required
                        value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} />
                    <div className="flex flex-col gap-1 w-full">
                        <label className="text-sm font-bold text-black">Role</label>
                        <select value={role} onChange={e => setRole(e.target.value as StaffRole)} required
                            className="w-full text-sm p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <Button type="submit" buttonText={saving ? "Registering..." : "Register Staff"}
                    className="w-full !rounded-full !py-3 !text-sm" disabled={saving} />
            </form>
        </div>
    );
}
