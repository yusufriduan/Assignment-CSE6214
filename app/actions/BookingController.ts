"use server";

import { adminDb } from "@/lib/DatabaseInitializer";
import { Booking, Resource, User } from "@/types";
import { Timestamp } from "firebase-admin/firestore";
import { cleanFirestoreData } from "@/lib/utils";
import { transporter } from "@/lib/EmailInitializer";

export async function getStudentBookings(userId: string): Promise<Booking[]> {
    try {
        const snapshot = await adminDb.collection('Bookings')
            .where('booking_owner', '==', userId)
            .get();

        return snapshot.docs.map(doc => ({
            booking_id: doc.id,
            ...cleanFirestoreData(doc.data()),
        })) as Booking[];
    } catch (error) {
        console.error("Error fetching student bookings:", error);
        return [];
    }
}

export async function createBooking(bookingData: Booking) {
    try {
        if (bookingData.booking_end <= bookingData.booking_start) {
            throw new Error("Booking end time must be after start time");
        }

        await adminDb.collection("bookings").add({
            ...bookingData,
        });
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
                    booking_start: data.booking_start.toDate(),
                    booking_end: data.booking_end.toDate(),
                    booking_status: data.booking_status,
                    booking_reason: data.booking_reason,
                    resource: resource,
                    request_created_at: data.request_created_at.toDate(),
                    prev_booking: data.prev_booking
                })
            }
        }
        return bookingList;
    } catch (error){
        console.log(error);
        return [];
    }
}

export async function approveBooking(bookingId: string, email: string){
    try{
        const bookingRef = await adminDb.collection('Bookings').doc(bookingId);
        await bookingRef.update({
            booking_status: "Booked"
        })

        // send email

        return {success: true}
    } catch (error){
        console.log(error);
        return {error: error}
    }
}

export async function rejectBooking(bookingId: string, email: string, reason: string, name: string, resource: string){
    try{
        const bookingRef = await adminDb.collection('Bookings').doc(bookingId);
        await bookingRef.update({
            booking_status: "Rejected"
        })

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
                <p>We regret to inform you that your booking request for ${resource} has been rejected for the following reasons:</p>
                <b>${reason}</b>
                
                <p>If you wish to contact us regarding the decision, feel free to reply to this email and a staff will get to you soon.</p>
                <br>
                <img src="https://tqhyjalqieggxdxrmetq.supabase.co/storage/v1/object/public/profile_pictures/absolutecinema.png" alt="crbs-pic" width="150"></img>
            </div>

            `,
        };

        const info = await transporter.sendMail(mailOptions);
        
        console.log('Email sent successfully! Message ID:', info.messageId);

        return {success: true}
    } catch (error){
        console.log(error);
        return {error: error}
    }
}