"use server";
import { registerUser, loginUser, verifyEmail, resetPassword } from "@/app/actions/UserController";

export async function handleRegistration(formData: FormData) {
    const user_id = formData.get("student-id") as string;
    const name = formData.get("full-name") as string;
    const email = formData.get("student-email") as string;
    const password = formData.get("password") as string;
    const phone_number = formData.get("contact-number") as string;
    const department = formData.get("department") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const response = await registerUser({
        user_id,
        name,
        email,
        password,
        contact_number: phone_number,
        department
    });

    return response;
}

export async function handleLogin(formData: FormData) {
    const user_id = formData.get("user-id") as string;
    const password = formData.get("password") as string;

    if (!user_id || !password) {
        return { success: false, message: "Student ID and password are required" };
    }

    const response = await loginUser(user_id, password);

    return response;
}

export async function handleVerifyEmail(formData: FormData) {
    const email = formData.get("email") as string;

    if (!email)
        return { success: false, message: "Email is required" };

    return await verifyEmail(email);
}

export async function handleResetPassword(formData: FormData) {
    const user_id = formData.get("user-id") as string;
    const newPassword = formData.get("new-password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    if (!user_id) {
        return { success: false, message: "User ID is required" };
    }

    if (newPassword !== confirmPassword) {
        return { success: false, message: "Passwords do not match" };
    }

    return await resetPassword(user_id, newPassword);
}