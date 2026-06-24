import { adminDb } from '@/lib/DatabaseInitializer';
import bcrypt from 'bcrypt';
import { User } from '@/types';

export class UserController {
    static async registerUser(newUserParams: {
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

    static async loginUser(user_id: string, password: string) {
        try {
            console.log('Private Key:', process.env.private_key); // Debugging line
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

            return { success: true, message: 'Login successful', user: userData };
        } catch (error) {
            console.error('Error logging in:', error);
            return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
        }
    }

    static async verifyEmail(email: string) {
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

    static async resetPassword(user_id: string, newPassword: string) {
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
}
