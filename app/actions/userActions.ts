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
        };
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw new Error("Failed to update user profile");
    }
}

export async function fetchUsersBookingHistory() {
    try {
        const usersSnapshot = await adminDb.collection('Users')
            .where('role', 'in', ['Student', 'Campus Staff'])
            .get();

        const history = [];

        for (const userDoc of usersSnapshot.docs) {
            const userData = userDoc.data();
            const userRef = userDoc.ref;
            const bookingsSnapshot = await adminDb.collection('Bookings')
                .where('booking_owner', '==', userRef)
                .get();

            const bookings = [];
            for (const bookingDoc of bookingsSnapshot.docs) {
                const bookingData = bookingDoc.data();
                if (!bookingData) continue;

                const resourceRef = bookingData.resource as DocumentReference;
                const resourceSnap = await resourceRef.get();
                const resourceData = resourceSnap.data();
                if (!resourceData) continue;

                bookings.push({
                    booking_id: bookingDoc.id,
                    booking_owner: {
                        user_id: userDoc.id,
                        ...cleanFirestoreData(userData),
                    },
                    resource: {
                        resource_id: resourceSnap.id,
                        resource_name: resourceData.resource_name,
                        resource_dept: resourceData.resource_dept,
                        resource_img_url: resourceData.resource_img_url,
                        resource_status: resourceData.status,
                        resource_equipments: resourceData.resource_equipments,
                    },
                    booking_start: (bookingData.booking_start as Timestamp).toDate(),
                    booking_end: (bookingData.booking_end as Timestamp).toDate(),
                    booking_status: bookingData.booking_status,
                    booking_reason: bookingData.booking_reason,
                    request_created_at: (bookingData.request_created_at as Timestamp).toDate(),
                    prev_booking: bookingData.prev_booking,
                });
            }

            history.push({
                user_id: userDoc.id,
                name: userData.name,
                faculty: userData.department,
                matric: userData.user_id,
                role: userData.role,
                bookings,
            });
        }

        return history;
    } catch (error) {
        console.error("Error fetching users booking history:", error);
        return [];
    }
}
