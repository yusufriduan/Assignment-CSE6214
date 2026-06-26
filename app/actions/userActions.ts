"use server";

import { adminDb } from "@/lib/DatabaseInitializer";
import { User } from "@/types";
import { cleanFirestoreData } from "@/lib/utils";

export async function fetchUserForAutofill(user_id: string) {
    try {
        const doc = await adminDb.collection('Users').doc(user_id).get();
        
        if (doc.exists) {
            const data = doc.data();
            return {
                name: data?.name || '',
                email: data?.email || '',
                contact_number: data?.contact_number || '',
                department: data?.department || ''
            };
        }
        return null;
    } catch (error) {
        console.error("Error fetching user for autofill:", error);
        return null;
    }
}

export async function getUserProfile(user_id: string): Promise<User | null> {
    try {
        const doc = await adminDb.collection('Users').doc(user_id).get();
        if (!doc.exists)
            return null;
        return {
            user_id: doc.id,
            ...cleanFirestoreData(doc.data())
        } as User;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw new Error("Failed to fetch user profile");
    }
}

export async function updateUserProfile(user_id: string, updatedData: Partial<User>) {
    try {
        await adminDb.collection('Users').doc(user_id).update(updatedData);
        return {
            success: true,
        }
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw new Error("Failed to update user profile");
    }
}