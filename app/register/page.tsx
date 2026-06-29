"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { handleRegistration } from "@/app/actions/authActions";
import { signIn } from "next-auth/react";
import Input from "../components/input";
import Button from "../components/Button";

export default function Register() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const passwordInput = showPassword ? "text" : "password";

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const response = await handleRegistration(formData);

        if (response?.success) {
            const userId = formData.get("student-id") as string;
            const password = formData.get("password") as string;

            // After successful registration, automatically sign the user in
            const signInResponse = await signIn("credentials", {
                user_id: userId,
                password: password,
                redirect: false, // Manual Handle sign-in
            });

            if (signInResponse?.ok && !signInResponse.error) {
                alert(response.message);
                router.push("/dashboard");
            } else {
                // This case handles if registration is successful but login fails.
                alert(`Registration successful, but auto-login failed. Please log in manually. Error: ${signInResponse?.error}`);
                router.push("/login");
            }
        } else {
            alert(`Registration failed: ${response?.message || "Unknown error"}`);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-radial-[at_0%_100%] from-black to-gray-200 bg-[length:200%_200%] animate-gradient">
            <div className="flex flex-col justify-center h-fit min-w-[60%] max-w-md p-6 bg-white/45 rounded-lg backdrop-blur-sm">
                <h1 className="text-2xl font-bold">Register</h1>
                <p className="text-sm text-gray-600">Let's create you a student account!</p>
                <form className="mt-6 flex flex-col gap-8 items-center" onSubmit={onSubmit}>
                    <Input name="student-id" label="Student ID" type="text" placeholder="Student ID" required />
                    <Input name="full-name" label="Full Name" type="text" placeholder="Full Name" required />
                    <Input name="department" label="Faculty" type="text" placeholder="Faculty" required />
                    <Input name="contact-number" label="Phone Number" type="text" placeholder="Phone Number" required />
                    <Input name="student-email" label="Student Email" type="text" placeholder="Student Email" required />
                    <Input name="password" label="Password" type={passwordInput} placeholder="Password" id="register-password" required />
                    <div className="w-full">
                        <Input name="confirm-password" label="Confirm Password" type={passwordInput} placeholder="Confirm Password" id="confirm-password" required />
                        <div className="flex items-center mt-2">
                            <input type="checkbox" id="showPassword" className="form-checkbox h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
                            <label htmlFor="showPassword" className="ml-2 block text-sm">
                                Show password
                            </label>
                        </div>
                    </div>
                    <Button type="submit" className="!w-fit !rounded-3xl !py-3 !px-5 rounded-md !hover:bg-blue-600 !transition-colors" buttonText='Register' />
                </form>
                <div className="text-sm mt-8">
                    <p>Existing user?{" "}
                        <a href="/login" className="font-bold underline">Login</a>
                    </p>
                </div>

            </div>
        </div>
    )
}