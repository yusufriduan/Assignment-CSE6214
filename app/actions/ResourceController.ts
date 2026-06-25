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

export async function addResource(data: Resource){
    const docRef = await adminDb.collection('Resources').add(data);

    if(docRef.id){
        return (
            {success: true}
        )
    }
}

export async function modifyResource(id: string, name: string, img: string | null, equipments: FirestoreEquipmentItem[]){
    const docRef = adminDb.collection('Resources').doc(id);
    try{
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