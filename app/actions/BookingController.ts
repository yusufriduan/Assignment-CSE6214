"use server";

import { adminDb } from "@/lib/DatabaseInitializer";
import { Booking, Resource, User, Notification } from "@/types";
import { Timestamp, DocumentReference } from "firebase-admin/firestore";
import { cleanFirestoreData } from "@/lib/utils";
import { transporter } from "@/lib/EmailInitializer";
import { auth } from "@/auth";
import { createNotification } from "./NotificationController";
import { collection, query, where } from "firebase/firestore";

export async function getUserBookings(): Promise<Booking[]> {
    try {
        const session = await auth();
        const userId = String((session?.user as any)?.user_id || session?.user?.id);

        if (!userId) {
            console.error("[BookingController] Not authenticated");
            return [];
        }

        console.log(`[BookingController] Fetching bookings matching reference: Users/${userId}`);
        const userRef = adminDb.collection('Users').doc(userId);
        const snapshot = await adminDb.collection('Bookings')
            .where('booking_owner', '==', userRef)
            .get();

        if (snapshot.empty) {
            return [];
        }

        const bookingList: any[] = [];
        for (const doc of snapshot.docs) {
            const data = doc.data();
            if (data) {
                try {
                    // 1. Resolve Owner safely
                    const ownerSnap = await (data.booking_owner as DocumentReference).get();
                    const ownerData = ownerSnap.data() || {};
                    const owner: User = {
                        user_id: ownerSnap.id,
                        ...cleanFirestoreData(ownerData),
                    } as User;

                    // 2. Resolve Resource safely (with fallback!)
                    let resource: Resource = {
                        resource_id: "unknown",
                        resource_name: "Unknown Resource (Data Error)",
                        resource_dept: "N/A",
                        resource_status: "Available"
                    };

                    // Check if it's actually a reference before trying to get it
                    if (data.resource && typeof data.resource.get === 'function') {
                        const resourceSnap = await (data.resource as DocumentReference).get();
                        const resourceData = resourceSnap.data();
                        
                        if (resourceData) {
                            resource = {
                                resource_id: resourceSnap.id,
                                resource_name: resourceData.resource_name || "Unnamed",
                                resource_dept: resourceData.resource_dept || "N/A",
                                resource_img_url: resourceData.resource_img_url,
                                resource_status: resourceData.status || "Available",
                                resource_equipments: resourceData.resource_equipments
                            };
                        }
                    } else if (typeof data.resource === 'object' && data.resource.resource_name) {
                        // Scenario B: It was saved as a Map/Object (Old Test Bookings)
                        resource = {
                            resource_id: data.resource.resource_id || "unknown",
                            resource_name: data.resource.resource_name,
                            resource_dept: data.resource.resource_dept || "N/A",
                            resource_img_url: data.resource.resource_img_url,
                            resource_status: data.resource.resource_status || "Available",
                            resource_equipments: data.resource.resource_equipments
                        };
                    } else {
                        console.warn(`[BookingController] Warning: Booking ${doc.id} is missing resource field.`);
                    }

                    bookingList.push({
                        booking_id: doc.id,
                        booking_owner: owner,
                        resource: resource,
                        // Safely handle both Firestore Timestamps and strings
                        booking_start: data.booking_start?.toDate ? data.booking_start.toDate().toISOString() : data.booking_start,
                        booking_end: data.booking_end?.toDate ? data.booking_end.toDate().toISOString() : data.booking_end,
                        booking_status: data.booking_status || "Unknown",
                        booking_reason: data.booking_reason || "",
                        request_created_at: data.request_created_at?.toDate ? data.request_created_at.toDate().toISOString() : data.request_created_at,
                        prev_booking: doc.id || null
                    });
                    
                } catch (err) {
                    console.error(`[BookingController] Error processing booking doc ${doc.id}:`, err);
                }
            }
        }
        
        console.log(`[BookingController] Found ${bookingList.length} bookings for user: ${userId}`);
        return bookingList;
    } catch (error) {
        console.error("Error fetching student bookings:", error);
        return [];
    }
}

export async function createBooking(data: any) {
    try {

        console.log(data);
        const resourceRef = adminDb.collection("Resources").doc(data.resourceId);
        const resourceSnapshot = await resourceRef.get();
        const resourceData = resourceSnapshot.data()
        const userRef = adminDb.collection("Users").doc(data.userId)

        const bookingData = {
            booking_owner: userRef, // Store as a DocumentReference
            booking_start: data.bookingStart,
            booking_end: data.bookingEnd,
            booking_reason: data.bookingPurpose,
            resource: resourceRef, // Store as a DocumentReference
            booking_status: "Awaiting Approval",
            request_created_at: data.request_created_date
        };

        if (!data.resourceId) {
            throw new Error("No venue selected.");
        }

        if (bookingData.booking_end <= bookingData.booking_start) {
            throw new Error("Booking end time must be after start time");
        }

        await adminDb.collection("Bookings").add(bookingData);

        const resourceManagersQuery = await adminDb.collection("Users")
            .where("role", "==", "Resource Manager")
            .get();

        const notificationPromises = resourceManagersQuery.docs.map(async (doc) => {
            createNotification(doc.id, "New Booking Request", `A new booking request has been made for ${resourceData?.resource_name}.`);
        });

        await Promise.all(notificationPromises);
        return { success: true, message: "Booking created successfully" };
    } catch (error) {
        console.error("Error creating booking:", error);
        return { success: false, message: error instanceof Error ? error.message : "Unknown error" };
    }
}

export async function fetchAllBooking(){
    try{
        const bookingRef = await adminDb.collection("Bookings").get();
        const bookingList: Booking[] = [];
        for(const doc of bookingRef.docs){
            const data = doc.data();
            if(data){
                const ownerRef = await data.booking_owner.get();
                const ownerData = ownerRef.data();
                const owner: User = {
                    user_id: ownerRef.id,
                    name: ownerData.name,
                    email: ownerData.email,
                    department: ownerData.department,
                    contact_number: ownerData.contact_number,
                    role: ownerData.role,
                    account_status: ownerData.account_status,
                    two_factor_enabled: ownerData.two_factor_enabled,
                }

                const resourceRef = await data.resource.get();
                const resourceData = resourceRef.data();
                const resource: Resource = {
                    resource_id: resourceRef.id,
                    resource_name: resourceData.resource_name,
                    resource_dept: resourceData.resource_dept,
                    resource_img_url: resourceData.resource_img_url,
                    resource_status: resourceData.status,
                    resource_equipments: resourceData.resource_equipments
                }

                bookingList.push({
                    booking_id: doc.id,
                    booking_owner: owner,
                    booking_start: data.booking_start.toDate().toISOString(),
                    booking_end: data.booking_end.toDate().toISOString(),
                    booking_status: data.booking_status,
                    booking_reason: data.booking_reason,
                    resource: resource,
                    request_created_at: data.request_created_at.toDate(),
                    prev_booking: doc.id
                })
            }
        }
        return bookingList;
    } catch (error){
        console.log(error);
        return [];
    }
}

export async function rejectBooking(bookingId: string, email: string, reason: string, name: string, resource: string){
    try{
        const bookingRef = await adminDb.collection('Bookings').doc(bookingId);
        await bookingRef.update({
            booking_status: "Rejected"
        })

        const booking = await bookingRef.get();
        const bookingD = await booking.data();
        if(bookingD){
            const userRef = bookingD.booking_owner as DocumentReference;
            if(userRef){
                const userId = userRef.id
                await createNotification(userId, "Booking Rejected", `Your booking request for ${resource} has been rejected. Reason: ${reason}`);
            }
        }

        // send email
        const mailOptions = {
            from: `Campus Resource Booking System <${process.env.SMTP_FROM_EMAIL}>`,
            to: email,
            subject: 'Booking Request Rejection Notification',
            text: `Hello ${name},

            We regret to inform you that your booking request for ${resource} has been rejected for the following reason:
            ${reason}

            If you wish to contact us regarding the decision, feel free to reply to this email and a staff member will get back to you soon.`,
            html: `
            <div style="font-family: sans-serif; text-align: center;">
                <h1>Hello ${name},</h1>
                <p>We regret to inform you that your booking request for <b>${resource}</b> has been rejected for the following reasons:</p>
                <b>${reason}</b>
                
                <p>If you wish to contact us regarding the decision, feel free to reply to this email and a staff will get to you soon.</p>
                <br>
                <img src="https://tqhyjalqieggxdxrmetq.supabase.co/storage/v1/object/public/profile_pictures/absolutecinema.png" alt="crbs-pic" width="150"></img>
            </div>

            `,
        };

        await transporter.sendMail(mailOptions);

        return {success: true}
    } catch (error){
        console.log(error);
        return {error: error}
    }
}

export async function approveBooking(bookingId: string, email: string, name: string, resource_id: string, resource: string, start: Date, end: Date){
    try {
        const startDate = new Date(start);
        const endDate = new Date(end);

        const startTimestamp = Timestamp.fromDate(startDate);
        const endTimestamp = Timestamp.fromDate(endDate);

        const allResourceRefs = await adminDb.collection('Bookings')
        .where('resource', '==', `/Resources/${resource_id}`)
        .get();

    const conflictingDocs = allResourceRefs.docs.filter(doc => {
        // Exclude the current booking
        if (doc.id === bookingId) return false;

        const data = doc.data();
        
        // Ensure timestamps exist before comparing
        const bookingStart = data.booking_start;
        const bookingEnd = data.booking_end;

        const hasConflict = bookingEnd > startTimestamp && bookingStart < endTimestamp;

        return hasConflict;
    });

    if (conflictingDocs.length > 0) {
        const rejectionPromises = conflictingDocs.map(async (doc) => {
            const bookingData = doc.data();
            const conflictingBookingId = doc.id;

            const userRef = typeof bookingData.booking_owner === 'string' 
                ? adminDb.doc(bookingData.booking_owner) 
                : bookingData.booking_owner;
            
            const userSnap = await userRef.get();
            const userData = userSnap.data() || {};

            const resRef = typeof bookingData.resource === 'string' 
                ? adminDb.doc(bookingData.resource) 
                : bookingData.resource;
                
            const resourceSnap = await resRef.get();
            const resourceData = resourceSnap.data() || {};

            const userEmail = userData.email || 'no-email@domain.com';
            const userName = userData.name || 'User';
            const resourceName = resourceData.resource_name || 'Requested Resource'; 
            const reason = "Time slot conflict with an approved booking.";

            return rejectBooking(conflictingBookingId, userEmail, reason, userName, resourceName);
        });

            const results = await Promise.all(rejectionPromises);
            console.log(`Processed ${results.length} rejections.`);
        }

        const bookingRef = adminDb.collection('Bookings').doc(bookingId);
        await bookingRef.update({
            booking_status: "Booked"
        });

        const resourceRef = adminDb.collection('Resources').doc(resource_id);
        await resourceRef.update({
            resource_status: "Booked"
        });
        const mailOptions = {
            from: `Campus Resource Booking System <${process.env.SMTP_FROM_EMAIL}>`,
            to: email,
            subject: 'Booking Request Approval Notification',
            text: `Hello ${name},

We are pleased to inform you that your booking request for ${resource} has been approved! Please do not forget to check in at least 24 hours before your booking starts to avoid it from being cancelled.

If you wish to contact us, feel free to reply to this email and a staff member will get back to you soon.`,
            html: `
            <div style="font-family: sans-serif; text-align: center;">
                <h1>Hello ${name},</h1>
                <p>
                    We are pleased to inform you that your booking request for <b>${resource}</b> has been approved! Please do not forget to check in
                    at least 24 hours before your booking starts to avoid it from being cancelled.
                </p>
                
                <p>If you wish to contact us, feel free to reply to this email and a staff member will get back to you soon.</p>
                <br>
                <img src="https://tqhyjalqieggxdxrmetq.supabase.co/storage/v1/object/public/profile_pictures/absolutecinema.png" alt="crbs-pic" width="150">
            </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        const booking = await bookingRef.get();
        const bookingD = await booking.data();
        if(bookingD){
            const userRef = bookingD.booking_owner as DocumentReference;
            if(userRef){
                const userId = userRef.id
                await createNotification(userId, "Booking Approved", `Your booking request for ${resource} has been approved.`);

            }

            const prevBookingRef = bookingD.prev_booking as DocumentReference;
            await bookingRef.update({
                prev_booking: null
            })
            if(prevBookingRef){
                await prevBookingRef.delete();
            }
        }
       
        return { success: true };
    } catch (error: any) {
        console.log(error);
        return { error: error.message || error };
    }
}


export async function getBookingWithinDuration(start: Timestamp, end: Timestamp){
    try{
        const bookingRef = await adminDb.collection('Bookings').where('booking_start', '>=', start).where('booking_start', '<=', end).get();
        return bookingRef;
    } catch (error){
        return {error: error}
    }
}

// EDIT BOOKING FUNCTIONS

interface EditBookingData {
  booking_id: string;
  user_id: string;
  resource_id: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  purpose: string;
  prev_booking: string;
}

export async function fetchBookingForEdit(bookingId: string) {
  try {
    const bookingRef = await adminDb.collection('Bookings').doc(bookingId).get();
    const bookingData = bookingRef.data();

    if (!bookingData) {
      return { error: "Booking not found" };
    }

    // Get owner details
    const ownerRef = await bookingData.booking_owner.get();
    const ownerData = ownerRef.data();

    // Get resource details
    const resourceRef = await bookingData.resource.get();
    const resourceData = resourceRef.data();

    // Format dates for input fields
    const startDate = bookingData.booking_start.toDate();
    const endDate = bookingData.booking_end.toDate();

    return {
      success: true,
      data: {
        booking_id: bookingId,
        user_id: ownerData.user_id || "",
        fullName: ownerData.name || "",
        phone: ownerData.contact_number || "",
        email: ownerData.email || "",
        startDate: startDate.toISOString().split('T')[0],
        startTime: startDate.toTimeString().slice(0, 5),
        endDate: endDate.toISOString().split('T')[0],
        endTime: endDate.toTimeString().slice(0, 5),
        purpose: bookingData.booking_reason || "",
        venue: resourceData.resource_dept || "",
        room: resourceData.resource_name || "",
        resource_id: resourceRef.id,
        equipments: resourceData.resource_equipments || [],
        prev_booking: bookingId,
      }
    };
  } catch (error) {
    console.error("Error fetching booking:", error);
    return { error: "Failed to load booking details" };
  }
}

export async function editBooking(data: EditBookingData) {
  try {
    const startDateTime = new Date(`${data.startDate}T${data.startTime}`);
    const endDateTime = new Date(`${data.endDate}T${data.endTime}`);

    // Get references
    const userRef = adminDb.collection('Users').doc(data.user_id);
    const resourceRef = adminDb.collection('Resources').doc(data.resource_id);
    
    // Create new booking document with edited details
    const newBookingRef = adminDb.collection('Bookings').doc();
    
    await newBookingRef.set({
      booking_owner: userRef,
      resource: resourceRef,
      booking_start: Timestamp.fromDate(startDateTime),
      booking_end: Timestamp.fromDate(endDateTime),
      booking_status: "Awaiting Approval",
      booking_reason: data.purpose,
      request_created_at: Timestamp.now(),
      prev_booking: adminDb.collection('Bookings').doc(data.prev_booking),
    });

    // Update original booking status to "Pending Re-approval"
    await adminDb.collection('Bookings').doc(data.prev_booking).update({
      booking_status: "Pending Re-approval"
    });

    // Notify Resource Managers about the edited booking
    const resourceManagersQuery = await adminDb.collection("Users")
      .where("role", "==", "Resource Manager")
      .get();

    const notificationPromises = resourceManagersQuery.docs.map(async (doc) => {
      createNotification(doc.id, "Booking Edit Request", `A booking request has been edited and needs re-approval.`);
    });

    await Promise.all(notificationPromises);

    return { success: true };
  } catch (error) {
    console.error("Error submitting edited booking:", error);
    return { error: "Failed to submit changes. Please try again." };
  }
}

export async function modifyBookingStatus(id: string, status: string){
    try{
        const bookingRef = await adminDb.collection("Bookings").doc(id);
        await bookingRef.update({
            booking_status: status
        })

        if(status === "Cancelled" || status === "Ended"){
            const bookingSnap = await bookingRef.get();
            const bookingData = bookingSnap.data()
            if(bookingData){
                const resourceRef = bookingData.resource;
                await resourceRef.update({
                    status: "Available"
                })
            }
        }
        return {success: true};
    } catch (error){
        return {error: error}
    }
}

