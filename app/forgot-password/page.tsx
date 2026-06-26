"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/Button";
import Input from "../components/input";
import { handleVerifyEmail, handleResetPassword } from "@/app/actions/authActions";

export default function forgotPassword() {
    const [step, setStep] = useState<"verify" | "reset">("verify");
    const [verifiedUserId, setVerifiedUserId] = useState("");
    const [email, setEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const passwordInput = showPassword ? "text" : "password";
    const router = useRouter();

    const onVerifyEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const result = await handleVerifyEmail(formData);

        if (result?.success && result.user?.user_id) {
            alert("Email verified! Please enter your new password.");
            setVerifiedUserId(result.user?.user_id);
            setStep("reset");
        } else {
            alert(result.message || "Verification failed.");
        }
    }

    const onResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        formData.append("user-id", verifiedUserId); // Append the verified user ID to the form data
        const result = await handleResetPassword(formData);
        if (result.success) {
            router.push("/login");
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-radial-[at_0%_100%] from-black to-gray-200 bg-[length:200%_200%] animate-gradient">
            <div className="flex flex-col justify-center h-100% min-w-[60%] max-w-md p-6 bg-white/45 rounded-lg backdrop-blur-sm">
                <h1 className="text-2xl font-bold">Forgot Password</h1>
                <p className="text-sm text-gray-600">Let's get you logged back in!</p>
                {step === "verify" ? (
                    <>
                        <form className="mt-6 flex flex-col gap-8 items-center" onSubmit={onVerifyEmail} >
                            <Input name="email" key="email" label="Email" type="text" placeholder="Email" required />
                            <Button type="submit" className="!w-fit !rounded-3xl !text-white !py-3 !px-5 rounded-md !hover:bg-blue-600 !transition-colors" buttonText='Reset Password' />
                            <div className="text-sm">
                                <p>Remember your password?{" "}
                                    <a href="/login" className="font-bold underline">Login</a>
                                </p>
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        <form className="mt-6 flex flex-col gap-8 items-center justify-center" onSubmit={onResetPassword}>
                            <input type="hidden" name="user-id" value={verifiedUserId} />
                            <Input name="new-password" label="Password" type={passwordInput} placeholder="Password" id="new-password" required />
                            <div className="w-full">
                                <Input name="confirm-password" label="Confirm Password" type={passwordInput} placeholder="Confirm Password" id="confirm-password" required />
                                <div className="flex items-center mt-2">
                                    <input type="checkbox" id="showPassword" className="form-checkbox h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
                                    <label htmlFor="showPassword" className="ml-2 block text-sm">
                                        Show password
                                    </label>
                                </div>
                            </div>
                            <Button type="submit" className="!w-fit !rounded-3xl !text-white !py-3 !px-5 rounded-md !hover:bg-blue-600 !transition-colors" buttonText='Reset Password' />
                            <div className="text-sm">
                                <p>Remember your password?{" "}
                                    <a href="/login" className="font-bold underline">Login</a>
                                </p>
                            </div>
                        </form>
                    </>
                )}
                

            </div>
        </div>
    )
}