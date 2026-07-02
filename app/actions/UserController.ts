"use server";
import { adminDb } from '@/lib/DatabaseInitializer';
import bcrypt from 'bcrypt';
import { User } from '@/types';
import { cleanFirestoreData } from '@/lib/utils';

export async function registerUser(newUserParams: {
    user_id: string;
    name: string;
    email: string;
    password: string;
    contact_number: string;
    department: string;
}) {
    try {
        const userRef = adminDb.collection('Users').doc(newUserParams.user_id);
        const userSnapshot = await userRef.get();

        if (userSnapshot.exists) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(newUserParams.password, 10);

        const newUser: User = {
            user_id: newUserParams.user_id,
            name: newUserParams.name,
            email: newUserParams.email,
            password: hashedPassword,
            contact_number: newUserParams.contact_number,
            department: newUserParams.department,
            role: 'Student',
            account_status: 'Active',
            two_factor_enabled: false
        };

        await userRef.set(newUser);
        return { success: true, message: 'User registered successfully' };
    } catch (error) {
        console.error('Error registering user:', error);
        return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export async function registerStaff(staffData: {
    user_id: string;
    name: string;
    email: string;
    password: string;
    contact_number: string;
    department: string;
    role: "Campus Staff" | "Resource Manager" | "Admin";
}) {
    try {
        const existing = await adminDb.collection("Users").doc(staffData.user_id).get();
        if (existing.exists) return { success: false, message: "User ID already registered" };

        const emailCheck = await adminDb.collection("Users").where("email", "==", staffData.email).get();
        if (!emailCheck.empty) return { success: false, message: "Email already registered" };

        const hashed = await bcrypt.hash(staffData.password, 10);
        const newUser: User = {
            ...staffData,
            password: hashed,
            account_status: "Active",
            two_factor_enabled: false
        };

        await adminDb.collection("Users").doc(staffData.user_id).set(newUser);
        return { success: true };
    } catch (error) {
        console.error("Error registering staff:", error);
        return { success: false, message: "Failed to register staff" };
    }
}

export async function loginUser(user_id: string, password: string) {
    try {
        const userRef = adminDb.collection('Users').doc(user_id);
        const userSnapshot = await userRef.get();

        if (!userSnapshot.exists) {
            throw new Error('Invalid user ID or password');
        }

        const userData = userSnapshot.data() as User;

        const passwordMatch = await bcrypt.compare(password, userData.password || '');
        if (!passwordMatch) {
            throw new Error('Incorrect password');
        }

        const { password: _password, ...safeUser } = userData;

        return { success: true, message: 'Login successful', user: safeUser as User };
    } catch (error) {
        console.error('Error logging in:', error);
        return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export async function verifyEmail(email: string) {
    try {
        const usersRef = adminDb.collection('Users');
        const q = usersRef.where('email', '==', email);
        const userSnapshot = await q.get();

        if (userSnapshot.empty) {
            throw new Error('Email not found');
        }

        const userDoc = userSnapshot.docs[0];
        return { success: true, message: 'Email verified', user: userDoc.data() as User };
    } catch (error) {
        console.error('Error verifying email:', error);
        return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export async function resetPassword(user_id: string, newPassword: string) {
    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const userRef = adminDb.collection('Users').doc(user_id);
        await userRef.update({ password: hashedPassword });
        return { success: true, message: 'Password reset successfully' };
    } catch (error) {
        console.error('Error resetting password:', error);
        return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export async function fetchAllUsers() {
    try {
        const snapshot = await adminDb.collection("Users").get();
        return snapshot.docs.map(doc => ({
            user_id: doc.id,
            ...cleanFirestoreData(doc.data())
        })) as User[];
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

export async function fetchUser(user_id: string) {
    try {
        const doc = await adminDb.collection("Users").doc(user_id).get();
        if (!doc.exists) return null;
        return { user_id: doc.id, ...cleanFirestoreData(doc.data()) } as User;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}

export async function modifyUser(user_id: string, data: Partial<User>) {
    try {
        const dataToUpdate = { ...data };

        if (!dataToUpdate.password || dataToUpdate.password.trim() === "") {
            delete dataToUpdate.password;
        } else {
            dataToUpdate.password = await bcrypt.hash(dataToUpdate.password, 10);
        } 

        await adminDb.collection("Users").doc(user_id).update(dataToUpdate);
        return { success: true };
    } catch (error) {
        console.error("Error updating user:", error);
        return { success: false, message: "Failed to update user" };
    }
}

export async function deleteUser(user_id: string) {
    try {
        await adminDb.collection("Users").doc(user_id).delete();
        return { success: true };
    } catch (error) {
        console.error("Error deleting user:", error);
        return { success: false, message: "Failed to delete user" };
    }
}



// export async function getAllFeedbacks() {
//     try {
//         const snapshot = await adminDb.collection("Feedbacks").orderBy("timestamp", "desc").get();
//         return snapshot.docs.map(doc => ({ id: doc.id, ...cleanFirestoreData(doc.data()) }));
//     } catch (error) {
//         console.error("Error fetching feedbacks:", error);
//         return [];
//     }
// }

export async function fetchUserForAutofill(user_id: string) {
    try {
        const doc = await adminDb.collection('Users').doc(user_id).get();
        
        if (doc.exists) {
            const data = doc.data();
            return {
                name: data?.name || '',
                email: data?.email || '',
                contact_number: data?.contact_number || '',
                department: data?.department || ''
            };
        }
        return null;
    } catch (error) {
        console.error("Error fetching user for autofill:", error);
        return null;
    }
}