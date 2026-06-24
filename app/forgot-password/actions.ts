"use server";
import { UserController } from "@/lib/controllers/UserController";

export async function handleVerifyEmail(formData: FormData) {
    const email = formData.get("email") as string;

    if (!email)
        return { success: false, message: "Email is required" };

    return await UserController.verifyEmail(email);
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

    return await UserController.resetPassword(user_id, newPassword);
}