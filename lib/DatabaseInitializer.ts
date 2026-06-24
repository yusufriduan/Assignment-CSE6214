// lib/DatabaseInitializer.ts
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const privateKey = process.env.private_key?.replace(/^"|"$/g, '').replace(/\\n/g, '\n') || '';

if (!getApps().length) {
    initializeApp({
        credential: cert({
            projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
            clientEmail: process.env.CLIENT_EMAIL,
            privateKey: privateKey, // 3. Pass the cleaned variable here
        }),
    });
}

export const adminDb = getFirestore();