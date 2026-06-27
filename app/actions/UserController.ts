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
