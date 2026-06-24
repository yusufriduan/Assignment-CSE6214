"use server";
import { UserController } from "@/lib/controllers/UserController";

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

    const response = await UserController.registerUser({
        user_id,
        name,
        email,
        password,
        contact_number: phone_number,
        department
    });

    return response;
}