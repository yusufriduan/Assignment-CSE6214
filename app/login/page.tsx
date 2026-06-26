"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "../components/input";
import Button from "../components/Button";
import { handleLogin } from "@/app/actions/authActions";

export default function Login() {
    const router = useRouter();
    const [step, setStep] = useState<"credentials" | "twoFactor">("credentials");
    const [showPassword, setShowPassword] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const passwordInput = showPassword ? "text" : "password";

    const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const response = await handleLogin(formData);

        if (response?.success) {
            if (response.user?.two_factor_enabled) {
                setUserEmail(response.user.email);
                setStep("twoFactor");
            } else {
                alert("Login successful! Redirecting to dashboard...");
                localStorage.setItem("user_id", response.user?.user_id || "");
                router.push("/dashboard");
            }
        } else {
            alert(response?.message || "Invalid username or password.");
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-radial-[at_0%_100%] from-black to-gray-200 bg-[length:200%_200%] animate-gradient">
            <div className="flex flex-col justify-center h-100% min-w-[60%] max-w-md p-6 bg-white/45 rounded-lg backdrop-blur-sm">
                {step === "credentials" ? (
                    <>
                        <h1 className="text-2xl font-bold">Login</h1>
                        <p className="text-sm text-gray-600">Let's get you logged back in!</p>
                        <form className="mt-6 flex flex-col items-center gap-8 w-full" onSubmit={handleLoginSubmit}>
                            <Input name="user-id" key="user-id" label="Username" type="text" placeholder="Student ID / Staff ID" required />
                            <div className="flex flex-col gap-1 w-full">
                                <Input name="password" key="password" label="Password" type={passwordInput} placeholder="Password" required />
                                <div className="flex items-center mt-2">
                                    <input type="checkbox" id="showPassword" className="form-checkbox h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
                                    <label htmlFor="showPassword" className="ml-2 block text-sm text-gray-700">
                                        Show password
                                    </label>
                                </div>
                            </div>
                            <Button type="submit" className="!text-white py-3 !rounded-2xl !w-45 justify-between" buttonText="→ Login" />
                        </form>
                        <div className="text-sm mt-8">
                            <p>New here?{" "}
                                <a href="/register" className="font-bold underline">Register</a>
                            </p>
                            <p>Forgot your password?{" "}
                                <a href="/forgot-password" className="font-bold underline">Recover Account</a>
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold">Two-Factor Authentication</h1>
                        <p className="text-sm text-gray-600">The code sent to {userEmail}.</p>
                        <form className="mt-6 flex flex-col gap-8">
                            <Input key="2faCode" label="Authentication Code" type="text" placeholder="Enter 2FA code" required />
                            <Button type="submit" className="flex items-center justify-center gap-3 text-white py-3 rounded-md cursor-pointer hover:bg-blue-600 transition-colors" buttonText="→ Verify" />
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}