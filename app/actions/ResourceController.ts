"use server"

import { adminDb } from "@/lib/DatabaseInitializer";

interface FirestoreEquipmentItem {
    equipment_name: string;
    equipment_count: number;
}

export type ResourceEquipment = [string, number];

export interface ResourceDataPayload {
    name: string;
    dept: string;
    img: string;
    status: string;
    equipments: ResourceEquipment[];
}

export async function fetchResource(resourceId: string): Promise<ResourceDataPayload | null>{
    try {
        const docRef = adminDb.collection('Resources').doc(resourceId);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return null;
        }

        const docData = docSnap.data();
        if (!docData) return null;

        let equipments: ResourceEquipment[] = [];

        if (Array.isArray(docData.resource_equipments)) {
            for (const equipment of docData.resource_equipments as FirestoreEquipmentItem[]) {
                equipments.push([equipment.equipment_name, equipment.equipment_count]);
            }
        }

        return {
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