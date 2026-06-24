import Button from "../Button";
import Input from "../input";
import { MdPerson, MdOutlineMail, MdOutlinePhone, MdPassword } from "react-icons/md";
import Toggle from "../toggleComponents";
import { useState } from "react";

interface EditProfileProps {
    setActiveSection: (section: string) => void;
}

export default function EditProfile({ setActiveSection }: EditProfileProps) {
    const [twoFAEnabled, setTwoFAEnabled] = useState(false);

    return (
        <div className="p-6 text-lg gap-2 w-full h-full max-w-lg mx-auto flex flex-col">
            <header className="flex flex-row items-start gap-1">
                <div>
                    <h1 className="text-2xl font-bold">Edit Profile</h1>
                    <p className="text-sm text-gray-600">Update your personal information.</p>
                </div>
            </header>
            <form className="mt-6 flex flex-col items-center gap-8">
                <div className="flex flex-row gap-4 items-center w-full bg-secondary/20 z-50 backdrop-blur-md p-4 rounded-3xl shadow-md">
                    <MdPerson className="text-4xl p-1 rounded-full w-10" />
                    <Input key="name" label="Full Name" type="text" placeholder="Full Name" required />
                </div>
                <div className="flex flex-col gap-4 w-full bg-secondary/20 z-50 backdrop-blur-md p-4 rounded-3xl shadow-md">
                    <div className="flex flex-row gap-4 items-center w-full">
                        <MdOutlineMail className="text-4xl p-1 rounded-full w-10" />
                        <Input key="email" label="Campus Email" type="text" placeholder="Campus Email" required />
                    </div>
                    <div className="flex flex-row gap-4 items-center w-full">
                        <MdOutlinePhone className="text-4xl p-1 rounded-full w-10" />
                        <Input key="phone-number" label="Phone Number" type="text" placeholder="Phone Number" required />
                    </div>
                </div>
                <div className="w-full h-1 bg-gray-300 rounded-full" />
                <div className="flex flex-col gap-4 w-full bg-secondary/20 z-50 backdrop-blur-md p-4 rounded-3xl shadow-md">
                    <div className ="flex flex-row gap-4 items-center w-full">
                        <MdPassword className="text-4xl text-white bg-foreground p-1 rounded-xl w-15" />
                        <Input key="current-password" label="Current Password" type="password" placeholder="Current Password" required />
                    </div>
                    <div className ="flex flex-row gap-4 items-center w-full">
                        <MdPassword className="text-4xl text-white bg-foreground p-1 rounded-xl w-15" />
                        <Input key="new-password" label="New Password" type="password" placeholder="New Password" required />
                    </div>
                    <div className ="flex flex-row gap-4 items-center w-full">
                        <MdPassword className="text-4xl text-white bg-foreground p-1 rounded-xl w-15" />
                        <Input key="confirm-password" label="Confirm New Password" type="password" placeholder="Confirm New Password" required />
                    </div>
                    <div className ="flex flex-row gap-4 items-center w-full">
                        <div className="relative w-fit flex-shrink-0">
                            <MdOutlineMail className="text-5xl text-foreground" />
                            <MdPassword className="absolute top-0 right-0 w-7.5 bg-black rounded text-white p-0.5 translate-x-1 -translate-y-1" />
                        </div>
                        <Toggle label="Two Factor Authentication" initial={false} onToggle={(state) => {
                            const passwordFields = document.querySelectorAll<HTMLInputElement>('input[type="password"]');
                            passwordFields.forEach(field => {
                                field.type = state ? 'text' : 'password';
                            });
                        }} />
                    </div>
                </div>
                <div className="flex flex-row gap-4 w-full justify-center">
                    <Button type="reset" className="!w-fit !rounded-3xl !text-white !py-3 !px-5 rounded-md !hover:bg-blue-600 !transition-colors" buttonText="Cancel" onClick={() => setActiveSection("profile")} />
                    <Button type="submit" className="!w-fit !rounded-3xl !text-white !py-3 !px-5 rounded-md !hover:bg-blue-600 !transition-colors" buttonText="Save Changes" />
                </div>
            </form>
        </div>
    );
}