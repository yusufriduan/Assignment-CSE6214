"use server";

import { adminDb } from "@/lib/DatabaseInitializer";
import { DocumentReference } from "firebase-admin/firestore";
import { MaintenanceRequest } from "@/types";
import { Timestamp } from "firebase-admin/firestore";
import { transporter } from "@/lib/EmailInitializer";

export async function fetchAllRequests() {
    try {
        const maintenanceRef = await adminDb.collection('MaintenanceRequests').get();

        const promises = maintenanceRef.docs.map(async (doc) => {
            const data = doc.data();
            if (!data) return null;

            const [authorSnap, resourceSnap] = await Promise.all([
                data.request_author ? data.request_author.get() : null,
                data.faulty_resource ? data.faulty_resource.get() : null
            ]);

            const author = authorSnap?.data();
            const resource = resourceSnap?.data();

            if (!author || !resource) return null;

            return {
                fault_id: doc.id,
                fault_title: data.fault_title,
                request_author: author.name,
                request_author_email: author.email,
                faulty_resource_ref: data.faulty_resource.path,
                faulty_resource_name: resource.resource_name,
                faulty_resource_dept: resource.resource_dept,
                fault_detail: data.fault_detail,
                proof_url: data.proof_url,
                status: data.status,
                request_date: data.request_date?.toDate() || new Date(),
                scheduledServiceDate: data.scheduledServiceDate?.toDate() || null
            } as MaintenanceRequest;
        });

        const results = await Promise.all(promises);

        return results.filter((item): item is MaintenanceRequest => item !== null);

    } catch (error) {
        console.error("Error fetching maintenance requests:", error);
        return [];
    }
}


export async function fetchRequest(reportId: string){
    try{
        const maintenanceRef = await adminDb.collection("MaintenanceRequests").doc(reportId).get();
        const data = maintenanceRef.data();
        if(data){
            async function getUser(user: DocumentReference){
                const author = await user.get();
                return author.data();    
            }

            async function getResource(resource: DocumentReference){
                const res = await resource.get();
                return res.data();
            }

            const [author, resource] = await Promise.all([
                getUser(data.request_author),
                getResource(data.faulty_resource)
            ]);

            if(author && resource){
                return{
                    fault_id: reportId,
                    fault_title: data.fault_title,
                    request_author: author.name,
                    request_author_email: author.email,
                    faulty_resource_ref: data.faulty_resource.path,
                    faulty_resource_name: resource.resource_name,
                    faulty_resource_dept: resource.resource_dept,
                    fault_detail: data.fault_detail,
                    proof_url: data.proof_url,
                    status: data.status,
                    request_date: data.request_date.toDate(),
                    scheduledServiceDate: data.scheduledServiceDate?.toDate() || null
                }
            }
        }
    } catch (error){
        console.log(error);
    }
    return null;
}

export async function getUserRequest(userId: string): Promise<MaintenanceRequest[]> {
    try {
        const userRef = adminDb.collection('Users').doc(userId);
        const snapshot = await adminDb.collection('MaintenanceRequests')
            .where('request_author', '==', userRef)
            .get();

        const userRequests: MaintenanceRequest[] = [];

        // Fetch the user's name once to use for the `request_author` field.
        // This makes the returned data structure consistent with `fetchAllRequests`.
        const userDoc = await userRef.get();
        const userName = userDoc.data()?.name;
        const userEmail = userDoc.data()?.email;

        for (const doc of snapshot.docs) {
            const data = doc.data();
            
            if (!data) continue;

            // Resolve the faulty_resource reference to get its details.
            const resourceSnapshot = await data.faulty_resource.get();
            const resource = resourceSnapshot.data();

            // Ensure we have the resource details and the author's name before proceeding.
            if (resource && userName && userEmail) {
                userRequests.push({
                    fault_id: doc.id,
                    fault_title: data.fault_title,
                    request_author: userName,
                    request_author_email: userEmail,
                    fault_detail: data.fault_detail,
                    status: data.status,
                    request_date: data.request_date.toDate(),
                    faulty_resource_ref: data.faulty_resource.path,
                    faulty_resource_name: resource.resource_name, 
                    faulty_resource_dept: resource.resource_dept,
                    proof_url: data.proof_url,
                    scheduledServiceDate: data.scheduledServiceDate?.toDate() || null,
                });
            }
        }
        console.log(userRequests);
        return userRequests;
    } catch (error) {
        console.error("Error fetching student reports:", error);
        return [];
    }
}

export async function createRequest(reportData: MaintenanceRequest) {
    try {
        await adminDb.collection("MaintenanceRequests").doc(reportData.fault_id).set(reportData);
        return { success: true };
    } catch (error) {
        console.error("Error submitting fault report:", error);
        return { success: false };
    }
}

export async function scheduleService(requestId: string, resource: string, startingDate: Date, email: string, response: string, title: string){
    try{
        const date = Timestamp.fromDate(startingDate);
        const ref = await adminDb.collection("MaintenanceRequests").doc(requestId);
        await ref.update({
            scheduledServiceDate: date,
            status: "Scheduled"
        });


        const resourceRef = await adminDb.doc(resource);
        await resourceRef.update({
            status: "Under Maintenance"
        })

        const mailOptions = {
            from: `Campus Resource Booking System <${process.env.SMTP_FROM_EMAIL}>`,
            to: email,
            subject: 'Maintenace Request Response',
            text: `Hello user,

            Your recent maintenance request "${title}" has been received by our team and we have scheduled it for service.
            Thanks for your cooperation.

            Response by Resource Manager: ${response}

            If you wish to contact us, feel free to reply to this email and a staff member will get back to you soon.`,
            html: `
            <div style="font-family: sans-serif; text-align: center;">
                <h1>Hello user,</h1>
                <p>Your recent maintenance request "${title}" has been received by our team and we have scheduled it for service.
                Thanks for your cooperation.</p>

                <p>Response by Resource Manager: <b>${response}</b></p>

                <p>If you wish to contact us, feel free to reply to this email and a staff member will get back to you soon.<p>
                <img src="https://tqhyjalqieggxdxrmetq.supabase.co/storage/v1/object/public/profile_pictures/absolutecinema.png" alt="crbs-pic" width="150"></img>
            </div>

            `,
        };

        await transporter.sendMail(mailOptions);

        return {success: true}
    } catch(error){
        console.log(error);
        return {error: error}
    }  
}