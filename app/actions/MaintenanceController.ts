"use server";

import { adminDb } from "@/lib/DatabaseInitializer";
import { cleanFirestoreData } from "@/lib/utils";
import { DocumentReference } from "firebase-admin/firestore";
import { MaintenanceRequest } from "@/types";

export async function fetchAllRequests(){
    try{
        const maintenanceRef = await adminDb.collection('MaintenanceRequests').get();
        const maintenanceRequestList: MaintenanceRequest[] = [];
        for(const doc of maintenanceRef.docs) {
            const data = doc.data();
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
                    maintenanceRequestList.push({
                        fault_id: doc.id,
                        request_author: author.name,
                        faulty_resource_name: resource.resource_name,
                        faulty_resource_dept: resource.resource_dept,
                        fault_detail: data.fault_detail,
                        proof_url: data.proof_url,
                        status: data.status,
                        request_date: data.request_date.toDate(),
                        scheduledServiceDate: data.scheduledServiceDate.toDate()
                    })
                } else {
                    continue;
                }
            } else {
                return [];
            }
        };
        return maintenanceRequestList;
    } catch (error) {
        console.log(error);
        return [];
    }
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

        for (const doc of snapshot.docs) {
            const data = doc.data();
            
            if (!data) continue;

            // Resolve the faulty_resource reference to get its details.
            const resourceSnapshot = await data.faulty_resource.get();
            const resource = resourceSnapshot.data();

            // Ensure we have the resource details and the author's name before proceeding.
            if (resource && userName) {
                userRequests.push({
                    fault_id: doc.id,
                    request_author: userName,
                    fault_detail: data.fault_detail,
                    status: data.status,
                    request_date: data.request_date.toDate(),
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

export async function submitFaultReport(reportData: MaintenanceRequest) {
    try {
        await adminDb.collection("MaintenanceRequests").doc(reportData.fault_id).set(reportData);
        return { success: true };
    } catch (error) {
        console.error("Error submitting fault report:", error);
        return { success: false };
    }
}