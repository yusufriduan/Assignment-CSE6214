"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from "next-auth/react";
import { User } from '@/types';
import { getUserProfile } from '@/app/actions/userActions';

interface UserContextType {
    user: User | null;
    isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { data: session, status } = useSession();

    useEffect(() => {
        const fetchUser = async () => {
            const userId = (session?.user as User | undefined)?.user_id;

            if (userId) {
                try {
                    const userProfile = await getUserProfile(userId);
                    setUser(userProfile);
                } catch (error) {
                    console.error("Failed to fetch user profile:", error);
                }
            }
            setIsLoading(false);
        };

        fetchUser();
    }, [session, status]);

    return (
        <UserContext.Provider value={{ user, isLoading }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}