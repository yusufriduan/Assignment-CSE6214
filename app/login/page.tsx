"use client";

import { useState } from "react";
import Input from "../components/input";
import Button from "../components/Button";

interface MockBackendData {
    isValidPassword: boolean;
    userPreferences: {
        requiresTwoFactorAuth: boolean;
        email: string;
    };
}

export default function Login() {
    const [step, setStep] = useState<"credentials" | "twoFactor">("credentials");
    const [showPassword, setShowPassword] = useState(false);
    const passwordInput = showPassword ? "text" : "password";
    const mockBackendData: MockBackendData = {
        isValidPassword: true,
        userPreferences: {
            requiresTwoFactorAuth: false,
            email: "dummy@student.apu.edu.my",
        },
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (mockBackendData.isValidPassword) {
            if (mockBackendData.userPreferences.requiresTwoFactorAuth) {
                // Redirect to 2FA page or show 2FA prompt
                console.log("Redirecting to 2FA...");
                setStep("twoFactor");
            } else {
                // Redirect to dashboard or home page
                console.log("Login successful, redirecting...");
                alert("Login successful! Redirecting to dashboard...");
                window.location.href = "/dashboard";
            }
        } else {
            // Show error message
            alert("Invalid username or password. Please try again.");
        }
    }

    return (
        <div className="flex h-screen items-center justify-center bg-radial-[at_0%_100%] from-blue-500 to-gray-200 bg-[length:200%_200%] animate-gradient">
            <div className="flex flex-col justify-center h-100% min-w-[60%] max-w-md p-6 bg-white/45 rounded-lg backdrop-blur-sm">
                {step === "credentials" ? (
                    <>
                        <h1 className="text-2xl font-bold">Login</h1>
                        <p className="text-sm text-gray-600">Let's get you logged back in!</p>
                        <form className="mt-6 flex flex-col items-center gap-8 w-full" onSubmit={handleLoginSubmit}>
                            <Input key="username" label="Username" type="text" placeholder="Student ID / Staff ID" required />
                            <div className="flex flex-col gap-1 w-full">
                                <Input key="password" label="Password" type={passwordInput} placeholder="Password" required />
                                <div className="flex items-center mt-2">
                                    <input type="checkbox" id="showPassword" className="form-checkbox h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
                                    <label htmlFor="showPassword" className="ml-2 block text-sm text-gray-700">
                                        Show password
                                    </label>
                                </div>
                            </div>
                            <Button type="submit" className="!bg-blue-500 !text-white py-3 !rounded-2xl !w-45 justify-between" buttonText="→ Login" />
                        </form>
                        <div className="text-sm text-gray-600 mt-8">
                            <p>New here?{" "}
                                <a href="/register" className="text-blue-500 hover:underline">Register</a>
                            </p>
                            <p>Forgot your password?{" "}
                                <a href="/forgot-password" className="text-blue-500 hover:underline">Recover Account</a>
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold">Two-Factor Authentication</h1>
                        <p className="text-sm text-gray-600">The code sent to {mockBackendData.userPreferences.email}.</p>
                        <form className="mt-6 flex flex-col gap-8">
                            <Input key="2faCode" label="Authentication Code" type="text" placeholder="Enter 2FA code" required />
                            <Button type="submit" className="flex items-center justify-center gap-3 bg-blue-500 text-white py-3 rounded-md cursor-pointer hover:bg-blue-600 transition-colors" buttonText="→ Verify" />
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}