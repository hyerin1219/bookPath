'use client';

import { useEffect } from 'react';
import { useUser } from './UserContext';
import { useRouter } from 'next/navigation';

export const useLoginCheck = () => {
    const { userData } = useUser();
    const router = useRouter();

    useEffect(() => {
        // userData가 null이면 로그인 안 된 상태
        if (!userData) {
            window.alert('로그인 후 이용해 주세요!');
            router.push('/');
        }
    }, [userData, router]);
};
