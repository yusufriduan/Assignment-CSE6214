"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { useSession } from "next-auth/react";
import { User } from '@/types';
import { fetchUser } from '@/app/actions/UserController';

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
        const getUser = async () => {
            const userId = (session?.user as User | undefined)?.user_id;

            if (userId) {
                try {
                    const userProfile = await fetchUser(userId);
                    setUser(userProfile);
                } catch (error) {
                    console.error("Failed to fetch user profile:", error);
                }
            }
            setIsLoading(false);
        };

        getUser();
    }, [session, status]);

    const value = useMemo(() => ({ user, isLoading }), [user, isLoading]);

    return (
        <UserContext.Provider value={value}>
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