"use server";

import { adminDb } from "@/lib/DatabaseInitializer";
import { MaintenanceRequest, Booking, User, Resource } from "@/types";
import { cleanFirestoreData } from "../../lib/utils";
import { DocumentReference } from "firebase-admin/firestore";

export async function getDashboardSummary(user_id: string) {
    try{
        const userRef = adminDb.collection('Users').doc(user_id);
        const reportsSnapshot = await adminDb.collection('MaintenanceRequests')
            .where('request_author', '==', userRef)
            .get();
        
            let openReportsCount = 0;
            let closedReportsCount = 0;

            reportsSnapshot.forEach((doc) => {
                const status = doc.data().status;
                if (status === "Resolved")
                    closedReportsCount++;
                else
                    openReportsCount++;
            });

            const now = new Date();
            const bookingsSnapshot = await adminDb.collection('Bookings')
                .where('booking_owner', '==', userRef)
                .where('booking_start', '>=', now)
                .orderBy('booking_start', 'asc')
                .limit(5)
                .get();
            
            const userDoc = await userRef.get();
            const owner = {
                user_id: userDoc.id,
                ...cleanFirestoreData(userDoc.data())
            } as User;

            const upcomingEvents: Booking[] = [];

            for (const doc of bookingsSnapshot.docs) {
                const data = doc.data();
                
                const resourceRef = data.resource as DocumentReference;
                const resourceSnap = await resourceRef.get();
                const resourceData = resourceSnap.data();

                if (resourceData) {
                    const resource: Resource = {
                        resource_id: resourceSnap.id,
                        resource_name: resourceData.resource_name,
                        resource_dept: resourceData.resource_dept,
                        resource_img_url: resourceData.resource_img_url,
                        resource_status: resourceData.status,
                        resource_equipments: resourceData.resource_equipments
                    };

                    upcomingEvents.push({
                        booking_id: doc.id,
                        booking_owner: owner,
                        resource: resource,
                        booking_start: data.booking_start.toDate(),
                        booking_end: data.booking_end.toDate(),
                        booking_status: data.booking_status,
                        booking_reason: data.booking_reason,
                        request_created_at: data.request_created_at.toDate(),
                        prev_booking: data.prev_booking,
                    });
                }
            }

        console.log("Dashboard Summary:", { openReportsCount, closedReportsCount, upcomingEvents });
        return { openReportsCount, closedReportsCount, upcomingEvents };
    } catch (error) {
        console.error("Error fetching dashboard summary:", error);
        return { openReportsCount: 0, closedReportsCount: 0, upcomingEvents: [] };
    }
}