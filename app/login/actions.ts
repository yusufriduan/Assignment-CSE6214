"use server";
import { UserController } from "@/lib/controllers/UserController";

export async function handleLogin(formData: FormData) {
    const user_id = formData.get("user-id") as string;
    const password = formData.get("password") as string;

    if (!user_id || !password) {
        return { success: false, message: "Student ID and password are required" };
    }

    const response = await UserController.loginUser(user_id, password);

    return response;
}