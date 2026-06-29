"use server";

import { adminDb } from "@/lib/DatabaseInitializer";
import { User } from "@/types";
import { cleanFirestoreData } from "@/lib/utils";
import bcrypt from "bcrypt";
import { google } from "googleapis";

export async function fetchAllUsers() {
    try {
        const snapshot = await adminDb.collection("Users").get();
        return snapshot.docs.map(doc => ({
            user_id: doc.id,
            ...cleanFirestoreData(doc.data())
        })) as User[];
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

export async function fetchUser(user_id: string) {
    try {
        const doc = await adminDb.collection("Users").doc(user_id).get();
        if (!doc.exists) return null;
        return { user_id: doc.id, ...cleanFirestoreData(doc.data()) } as User;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}

export async function modifyUser(user_id: string, data: Partial<User>) {
    try {
        await adminDb.collection("Users").doc(user_id).update(data);
        return { success: true };
    } catch (error) {
        console.error("Error updating user:", error);
        return { success: false, message: "Failed to update user" };
    }
}


export async function deleteUser(user_id: string) {
    try {
        await adminDb.collection("Users").doc(user_id).delete();
        return { success: true };
    } catch (error) {
        console.error("Error deleting user:", error);
        return { success: false, message: "Failed to delete user" };
    }
}

export async function registerStaff(staffData: {
    user_id: string;
    name: string;
    email: string;
    password: string;
    contact_number: string;
    department: string;
    role: "Campus Staff" | "Resource Manager" | "Admin";
}) {
    try {
        const existing = await adminDb.collection("Users").doc(staffData.user_id).get();
        if (existing.exists) return { success: false, message: "User ID already registered" };

        const emailCheck = await adminDb.collection("Users").where("email", "==", staffData.email).get();
        if (!emailCheck.empty) return { success: false, message: "Email already registered" };

        const hashed = await bcrypt.hash(staffData.password, 10);
        const newUser: User = {
            ...staffData,
            password: hashed,
            account_status: "Active",
            two_factor_enabled: false
        };

        await adminDb.collection("Users").doc(staffData.user_id).set(newUser);
        return { success: true };
    } catch (error) {
        console.error("Error registering staff:", error);
        return { success: false, message: "Failed to register staff" };
    }
}

export async function fetchFeedbacks() {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
            },
            scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
        });

        const sheets = google.sheets({ version: "v4", auth });
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEETS_SHEET_ID,
            range: "Sheet1!A:E",
        });

        const rows = response.data.values;
        if (!rows || rows.length <= 1) return [];

        const [, ...data] = rows;
        return data.map((row, i) => ({
            id: i + 1,
            timestamp: row[0] || "",
            name: row[1] || "",
            studentId: row[2] || "",
            rating: row[3] || "",
            feature: row[4] || "",
            comments: row[5] || "",
        }));
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        return [];
    }
}