'use client';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import { auth, googleProvider } from '@/components/commons/libraries/firebase';

// useAuth 훅: Firebase 인증 상태 관리
export const useAuth = (): {
    user: User | null;
    uid?: string;
    isOpen: boolean;
    loading: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleLogin: () => Promise<void>;
    handleLogout: () => Promise<void>;
} => {
    const [user, setUser] = useState<User | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const uid = user?.uid;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser ?? null);
        });

        return () => unsubscribe();
    }, []);

    const handleLogin = async (): Promise<void> => {
        if (loading) return;
        setLoading(true);

        try {
            await signInWithPopup(auth, googleProvider);
            setIsOpen(false);
        } catch (error) {
            console.error('로그인 실패:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async (): Promise<void> => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('로그아웃 실패:', error);
        }
    };

    return { user, uid, loading, isOpen, setIsOpen, handleLogin, handleLogout };
};
