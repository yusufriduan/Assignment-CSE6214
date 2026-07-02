import Button from "../Button";
import Input from "../input";
import { MdPerson, MdOutlineMail, MdOutlinePhone, MdPassword } from "react-icons/md";
import Toggle from "../toggleComponents";
import { useState, useEffect } from "react";
import { modifyUser } from "@/app/actions/UserController";
import { useUser } from "@/app/components/UserBoundary/UserContext";

interface EditProfileProps {
    setActiveSection: (section: string) => void;
}

export default function EditProfile({ setActiveSection }: EditProfileProps) {
    const [userId, setUserId] = useState("");
    const { user, isLoading: isUserLoading } = useUser();
    const [twoFAEnabled, setTwoFAEnabled] = useState(false);
    const [saveMessage, setSaveMessage] = useState("");
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleTwoFAToggle = async (state: boolean) => {
        setTwoFAEnabled(state);

        if (!userId) {
            return;
        }

        try {
            await modifyUser(userId, {
                two_factor_enabled: state,
            });
            setSaveMessage(state ? "Two-factor authentication enabled." : "Two-factor authentication disabled.");
        } catch (error) {
            console.error("Error updating two-factor setting", error);
            setSaveMessage("Failed to update two-factor authentication.");
        }
    };

    useEffect(() => {
        if (user) {
            setUserId(user.user_id);
            setFormData({
                fullName: user.name || "",
                email: user.email || "",
                phoneNumber: user.contact_number || "",
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            });
            setTwoFAEnabled(user.two_factor_enabled || false);
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;

        const password = (document.getElementsByName('currentPassword')[0] as HTMLInputElement).value;
        const newPassword = (document.getElementsByName("newPassword")[0] as HTMLInputElement)?.value;
        const confirmPassword = (document.getElementsByName("confirmPassword")[0] as HTMLInputElement)?.value;

        const isChangingPassword = password || newPassword || confirmPassword;

        if (isChangingPassword) {
            if (!password || !newPassword || !confirmPassword) {
                alert("Please fill in all password fields to change your password.");
                return;
            }

            if (newPassword !== confirmPassword) {
                alert("New password and confirm password do not match.");
                return;
            }
        }

        setIsSaving(true);
        try {
            const updateData: any = {
                name: formData.fullName,
                email: formData.email,
                contact_number: formData.phoneNumber,
                two_factor_enabled: twoFAEnabled,
            };

            if (isChangingPassword) {
                updateData.password = password;
            }

            await modifyUser(userId, updateData);

            alert("Profile successfully updated!");
            setSaveMessage("Profile updated successfully.");
        } catch (error) {
            console.error("Error updating profile", error);
            alert("Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-6 text-lg gap-2 w-full h-full max-w-lg mx-auto flex flex-col">
            <header className="flex flex-row items-start gap-1">
                <div>
                    <h1 className="text-2xl font-bold">Edit Profile</h1>
                    <p className="text-sm text-gray-600">Update your personal information.</p>
                    {saveMessage ? <p className="mt-2 text-sm text-green-700">{saveMessage}</p> : null}
                </div>
            </header>
            <form className="mt-6 flex flex-col items-center gap-8" onSubmit={handleSubmit}>
                <div className="flex flex-row gap-4 items-center w-full bg-secondary/20 z-50 backdrop-blur-md p-4 rounded-3xl shadow-md">
                    <MdPerson className="text-4xl p-1 rounded-full w-10" />
                    <Input 
                        key="fullName" 
                        label="Full Name" 
                        type="text" 
                        placeholder="Full Name" 
                        required 
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    />
                </div>
                <div className="flex flex-col gap-4 w-full bg-secondary/20 z-50 backdrop-blur-md p-4 rounded-3xl shadow-md">
                    <div className="flex flex-row gap-4 items-center w-full">
                        <MdOutlineMail className="text-4xl p-1 rounded-full w-10" />
                        <Input 
                            key="email" 
                            label="Campus Email" 
                            type="text" 
                            placeholder="Campus Email" 
                            required 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                    <div className="flex flex-row gap-4 items-center w-full">
                        <MdOutlinePhone className="text-4xl p-1 rounded-full w-10" />
                        <Input 
                            key="phoneNumber" 
                            label="Phone Number" 
                            type="text" 
                            placeholder="Phone Number" 
                            required 
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        />
                    </div>
                </div>
                <div className="w-full h-1 bg-gray-300 rounded-full" />
                <div className="flex flex-col gap-4 w-full bg-secondary/20 z-50 backdrop-blur-md p-4 rounded-3xl shadow-md">
                    <div className ="flex flex-row gap-4 items-center w-full">
                        <MdPassword className="text-4xl text-white bg-foreground p-1 rounded-xl w-15" />
                        <Input 
                            name="currentPassword"
                            key="currentPassword" 
                            label="Current Password" 
                            type="password" 
                            placeholder="Current Password"  
                            value={formData.currentPassword}
                            onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                        />
                    </div>
                    <div className ="flex flex-row gap-4 items-center w-full">
                        <MdPassword className="text-4xl text-white bg-foreground p-1 rounded-xl w-15" />
                        <Input 
                            name="newPassword"
                            key="newPassword" 
                            label="New Password" 
                            type="password" 
                            placeholder="New Password"  
                            value={formData.newPassword}
                            onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                        />
                    </div>
                    <div className ="flex flex-row gap-4 items-center w-full">
                        <MdPassword className="text-4xl text-white bg-foreground p-1 rounded-xl w-15" />
                        <Input 
                            name="confirmPassword"
                            key="confirmPassword" 
                            label="Confirm New Password" 
                            type="password" 
                            placeholder="Confirm New Password"  
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        />
                    </div>
                    <div className ="flex flex-row gap-4 items-center w-full">
                        <div className="relative w-fit flex-shrink-0">
                            <MdOutlineMail className="text-5xl text-foreground" />
                            <MdPassword className="absolute top-0 right-0 w-7.5 bg-black rounded text-white p-0.5 translate-x-1 -translate-y-1" />
                        </div>
                        <Toggle
                            label="Two Factor Authentication"
                            initial={twoFAEnabled}
                            onToggle={handleTwoFAToggle}
                        />
                    </div>
                </div>
                <div className="flex flex-row gap-4 w-full justify-center">
                    <Button type="reset" className="!w-fit !rounded-3xl !py-3 !px-5 rounded-md !hover:bg-blue-600 !transition-colors" buttonText="Cancel" onClick={() => setActiveSection("settings")} />
                    <Button type="submit" className="!w-fit !rounded-3xl !py-3 !px-5 rounded-md !hover:bg-blue-600 !transition-colors" buttonText={isSaving ? "Saving..." : "Save Changes"} disabled={isSaving} />
                </div>
            </form>
        </div>
    );
}