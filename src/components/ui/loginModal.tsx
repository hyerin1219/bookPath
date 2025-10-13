'use client';

import { useUser } from '@/hooks/UserContext';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LoginModalProps {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

declare const window: typeof globalThis & {
    Kakao: any;
};

export default function LoginModal({ setIsOpen }: LoginModalProps) {
    const { setUserData } = useUser();
    const [isKakaoReady, setIsKakaoReady] = useState(false);

    useEffect(() => {
        if (window.Kakao && window.Kakao.Auth.getAccessToken()) {
            const token = window.Kakao.Auth.getAccessToken();
            getUserInfo(token); // 새로고침 후에도 사용자 정보 복원
        }
    }, [isKakaoReady]);

    useEffect(() => {
        const KAKAO_API_KEY = process.env.NEXT_PUBLIC_KAKAO_API_KEY;
        const script = document.createElement('script');
        script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
        script.async = true;
        script.onload = () => {
            if (window.Kakao && !window.Kakao.isInitialized()) {
                window.Kakao.init(KAKAO_API_KEY);
                setIsKakaoReady(true);
                console.log('✅ 카카오 SDK 초기화 완료');
            }
        };
        document.head.appendChild(script);
    }, []);

    const getUserInfo = async (accessToken: string) => {
        try {
            const response = await fetch('https://kapi.kakao.com/v2/user/me', {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (!response.ok) throw new Error('사용자 정보 가져오기 실패');
            const data = await response.json();
            setUserData(data); // 전역 저장
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogin = () => {
        if (!isKakaoReady) return console.log('카카오 SDK 준비 안됨');

        window.Kakao.Auth.login({
            success: (authObj: any) => {
                getUserInfo(authObj.access_token);
                setIsOpen(false);
            },
            fail: (err: any) => console.error('로그인 실패', err),
        });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="relative bg-white p-10 py-5 rounded-xl shadow-[2px_2px_6px_rgba(0,0,0,0.1)]">
                <button onClick={handleLogin} className="w-[152px] h-[37px] bg-[url('/images/button_login.png')] bg-contain bg-no-repeat" />
                <button onClick={() => setIsOpen(false)} className="absolute top-[5px] right-[5px] w-[25px] h-[25px] bg-[url('/images/button_close.png')] bg-contain bg-no-repeat" />
            </motion.div>
        </div>
    );
}
