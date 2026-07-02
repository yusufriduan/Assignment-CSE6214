"use server";

import { adminDb } from "@/lib/DatabaseInitializer";
import { cleanFirestoreData } from "@/lib/utils";
import { Notification } from "@/types";

export async function fetchNotifications(userId: string) {
    try {
        const snapshot = await adminDb.collection("Notifications")
        .where("targetUser", "==", userId)
        .get();

    const notifications = snapshot.docs
    .map(doc => {
        const data = doc.data();
        return {
            notification_id: doc.id,
            ...data,
            timestamp: data.timestamp.toDate(), // convert here, overrides the spread field
        } as Notification;
    })
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return notifications
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return [];
    }
}

export async function createNotification(targetUserId: string, title: string, message: string) {
    try {
        await adminDb.collection("Notifications").add({
            targetUser: targetUserId,
            title: title,
            message: message,
            isRead: false,
            timestamp: new Date()
        });
        return { success: true };
    } catch (error) {
        console.error("Error creating notification:", error);
        return { success: false };
    }
}

export async function markAsRead(notification_id: string) {
    try {
        await adminDb.collection("Notifications").doc(notification_id).update({
            read: true
        });
        return { success: true };
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return { success: false };
    }
}