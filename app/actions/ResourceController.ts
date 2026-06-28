"use server"

import { adminDb } from "@/lib/DatabaseInitializer";

export interface FirestoreEquipmentItem {
    equipment_name: string;
    equipment_count: number;
}

export interface Resource {
    id: string | null;
    name: string;
    dept: string;
    img: string | null;
    status: string;
    equipments: FirestoreEquipmentItem[];
}

export async function fetchResource(resourceId: string): Promise<Resource | null>{
    try {
        const docRef = adminDb.collection('Resources').doc(resourceId);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return null;
        }

        const docData = docSnap.data();
        if (!docData) return null;

        let equipments: FirestoreEquipmentItem[] = [];

        if (Array.isArray(docData.resource_equipments)) {
            for (const equipment of docData.resource_equipments as FirestoreEquipmentItem[]) {
                equipments.push({
                    equipment_name: equipment.equipment_name,
                    equipment_count: equipment.equipment_count
                });
            }
        }

        return {
            id: resourceId,
            name: docData.resource_name || "",
            dept: docData.resource_dept || "",
            img: docData.resource_img_url || "",
            status: docData.status || "",
            equipments
        };
        
    } catch (error) {
        console.error("Failed to fetch resource from Firestore:", error);
        throw new Error("Internal Server Error");
    }
}

export async function fetchResourceByDept(department: string): Promise<Resource[] | null>{
    try{
        const resourceRef = adminDb.collection('Resources');
        const docRef = resourceRef.where('resource_dept', '==', department);
        const docSnap = await docRef.get();

        const resources: Resource[] = [];
        docSnap.forEach(docData => {
            let equipments: FirestoreEquipmentItem[] = [];

            if (Array.isArray(docData.data().resource_equipments)) {
                for (const equipment of docData.data().resource_equipments as FirestoreEquipmentItem[]) {
                    equipments.push({
                        equipment_name: equipment.equipment_name,
                        equipment_count: equipment.equipment_count
                    });
                }
            }
            resources.push({
                id: docData.id,
                name: docData.data().resource_name,
                dept: docData.data().resource_dept,
                img: docData.data().resource_img_url,
                status: docData.data().status,
                equipments
            })
        })
        return resources;
    } catch (error) {
        console.error("Failed to fetch resource from Firestore:", error);
        throw new Error("Internal Server Error");
    }
}

export async function addResource(data: Resource){

    const existingQuery = await adminDb.collection('Resources').where('resource_name', '==', data.name).get();

    if (!existingQuery.empty) {
        return { duplicateError: "A resource with this name already exists." };
    }

    const docRef = await adminDb.collection('Resources').add({
        resource_name: data.name,
        resource_dept: data.dept,
        resource_img_url: data.img,
        status: data.status,
        resource_equipments: data.equipments
    });

    if(docRef.id){
        return (
            {success: true}
        )
    } else {
        return(
            {error: "fail"}
        )
    }
}

export async function modifyResource(id: string, name: string, img: string | null, equipments: FirestoreEquipmentItem[]){
    const docRef = adminDb.collection('Resources').doc(id);
    try{

        const existingQuery = await adminDb.collection('Resources').where('resource_name', '==', name).get();

        // If a document matches, check if its ID is different from the current one
        const nameTakenByAnotherDoc = existingQuery.docs.some(doc => doc.id !== id);

        if (nameTakenByAnotherDoc) {
            return { duplicateError: "Another resource is already using this name." };
        }

        await docRef.update({
            resource_name: name,
            resource_img_url: img,
            resource_equipments: equipments
        })

        return {success: true}
    } catch (error) {
        console.error("Admin SDK update failed:", error);
        throw error;
    }
}

export async function deleteResource(id: string){
    try{
        const docRef = adminDb.collection('Resources').doc(id);

        /// Queue the deletion of the resource document
        adminDb.batch().delete(docRef);

        /// Delete all bookings associated with this resource
        const bookingsQuery = await adminDb.collection("Bookings")
            .where("resource", "==", docRef)
            .get();

        bookingsQuery.docs.forEach((bookingDoc) => {
            adminDb.batch().delete(bookingDoc.ref);
        });

        /// Delete all maintenance requests associated with this resource
        const maintenanceQuery = await adminDb.collection("MaintenanceRequests")
            .where("faulty_resource", "==", docRef)
            .get();

        maintenanceQuery.docs.forEach((maintenanceDoc) => {
            adminDb.batch().delete(maintenanceDoc.ref);
        });

        /// Commit the batch deletion
        await adminDb.batch().commit();

        return {success: true}
    } catch (error) {
        return {error: error}
    }
}