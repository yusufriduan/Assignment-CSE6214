"use client";
import { useState } from "react";
import Input from "../components/input";

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const passwordInput = showPassword ? "text" : "password";
    
    return (
        <div className="flex h-screen items-center justify-center bg-radial-[at_0%_100%] from-blue-500 to-gray-200 bg-[length:200%_200%] animate-gradient">
            <div className="flex flex-col justify-center h-fit w-fit p-6 bg-white/45 rounded-lg backdrop-blur-sm">
                <h1 className="text-2xl font-bold">Register</h1>
                <p className="text-sm text-gray-600">Let's create you a student account!</p>
                <form className="mt-6 flex flex-col gap-8">
                    <Input label="Student ID" type="text" placeholder="Student ID" required />
                    <Input label="Full Name" type="text" placeholder="Full Name" required />
                    <Input label="Student Email" type="text" placeholder="Student Email" required />
                    <Input label="Password" type={passwordInput} placeholder="Password" id="register-password" required />
                    <div>
                        <Input label="Confirm Password" type={passwordInput} placeholder="Confirm Password" id="confirm-password" required />
                        <div className="flex items-center mt-2">
                            <input type="checkbox" id="showPassword" className="form-checkbox h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
                            <label htmlFor="showPassword" className="ml-2 block text-sm text-gray-700">
                                Show password
                            </label>
                        </div>
                    </div>
                    <button type="submit" className="flex items-center justify-center gap-3 bg-blue-500 text-white py-3 rounded-md cursor-pointer hover:bg-blue-600 transition-colors">
                        <span>→</span>
                        <span>Register</span>
                    </button>
                </form>
                <div className="text-sm text-gray-600 mt-8">
                    <p>Existing user?{" "}
                        <a href="/login" className="text-blue-500 hover:underline">Login</a>
                    </p>
                </div>

            </div>
        </div>
    )
}