"use server";

import { adminDb } from "@/lib/DatabaseInitializer";
import { DocumentReference } from "firebase-admin/firestore";
import { MaintenanceRequest } from "@/types";
import { Timestamp } from "firebase-admin/firestore";
import { transporter } from "@/lib/EmailInitializer";
import { createNotification } from "./NotificationController";

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

            let status = "Pending";
            const serviceDate = data.scheduledServiceDate;
            if(serviceDate){
                status = "Scheduled"
            
                if(serviceDate.toDate() < new Date()){
                    status = "Complete"
                    await doc.ref.update({
                        status: "Complete"
                    })
                    await data.faulty_resource.update({
                        resource_status: "Available"
                    });
                }
            }

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
                status: status,
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

                let status = "Pending";
                const serviceDate = data.scheduledServiceDate;
                if(serviceDate){
                    status = "Scheduled"
                
                    if(serviceDate.toDate() < new Date()){
                        status = "Complete"
                        await adminDb.collection("MaintenanceRequests").doc(reportId).update({
                            status: "Complete"
                        })
                        await data.faulty_resource.update({
                            resource_status: "Available"
                        });
                    }
                }

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
                    status: status,
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
    const userRef = adminDb.doc(`Users/${reportData.request_author}`);
    const resourceRef = adminDb.doc(`Resources/${reportData.faulty_resource_ref}`);

    const dbPayload = {
      fault_title: reportData.fault_title,
      fault_detail: reportData.fault_detail,
      faulty_resource: resourceRef,
      request_author: userRef,
      proof_url: reportData.proof_url,
      request_date: reportData.request_date,
      scheduledServiceDate: reportData.scheduledServiceDate,
      status: reportData.status,

      faulty_resource_name: reportData.faulty_resource_name,
      faulty_resource_dept: reportData.faulty_resource_dept,
    };

    await adminDb.collection("MaintenanceRequests").doc(reportData.fault_id).set(dbPayload);

    const resourceManagersQuery = await adminDb.collection("Users")
      .where("role", "==", "Resource Manager")
      .get();

    const notificationPromises = resourceManagersQuery.docs.map(async (doc) => {
      await createNotification(
        doc.id, 
        "New Maintenance Request", 
        `A new maintenance request has been made for ${reportData.faulty_resource_name}.`
      );
    });

    await Promise.all(notificationPromises);
    return { success: true };

  } catch (error) {
    console.error("Error submitting fault report:", error);
    return { success: false, error: String(error) };
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

        const bookingRefs = await adminDb.collection("Bookings").where("resource", "==", resourceRef).get();
        bookingRefs.docs.map( async (doc) => {
            const data = doc.data();
            if(!data) return null;

            const bookingStart = data.booking_start.toDate();
            const bookingEnd = data.booking_end.toDate();
            const now = new Date();

            if(bookingStart < startingDate && bookingEnd > now){
                if(data.booking_status === "Awaiting Approval" || data.booking_status === "Pending Re-approval"){
                    doc.ref.update({
                        booking_status: "Rejected"
                    })
                } else {
                    doc.ref.update({
                        booking_status: "Cancelled"
                    })
                }
            }

            
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

        const userQuery = await adminDb.collection("Users").where("email", "==", email).limit(1).get();
        if (!userQuery.empty) {
            const userId = userQuery.docs[0].id;
            await createNotification(userId, "Maintenance Request Scheduled", `Your maintenance request "${title}" has been scheduled for service.`);
        }

        return {success: true}
    } catch(error){
        console.log(error);
        return {error: error}
    }  
}

export async function getMaintenanceRequestWithinDuration(start: Timestamp, end: Timestamp){
    try{
        const requestRef = await adminDb.collection('MaintenanceRequest').where('request_date', '>=', start).where('request_date', '<=', end).get();
        return requestRef;
    } catch (error){
        return {error: error}
    }
}