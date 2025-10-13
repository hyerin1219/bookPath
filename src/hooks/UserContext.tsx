// app/context/UserContext.tsx
'use client';

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface UserContextType {
    userData: any | null;
    setUserData: (data: any | null) => void;
}

declare const window: typeof globalThis & {
    Kakao: any;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [userData, setUserData] = useState<any | null>(null);

    // 새로고침 시 Kakao 토큰 확인 및 사용자 정보 복원
    useEffect(() => {
        const checkKakaoLogin = async () => {
            if (window.Kakao && window.Kakao.Auth.getAccessToken()) {
                const token = window.Kakao.Auth.getAccessToken();
                try {
                    const response = await fetch('https://kapi.kakao.com/v2/user/me', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (!response.ok) throw new Error('사용자 정보 가져오기 실패');
                    const data = await response.json();
                    setUserData(data);
                } catch (err) {
                    console.error(err);
                }
            }
        };

        checkKakaoLogin();
    }, []);

    return <UserContext.Provider value={{ userData, setUserData }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser must be used within UserProvider');
    return context;
};
