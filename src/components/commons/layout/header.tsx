'use client';

import LoginModal from '@/components/ui/loginModal';
import { useAuth } from '@/hooks/useAuth';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, handleLogout } = useAuth();

    const handleOpenLoginModal = () => setIsOpen(true);

    return (
        <>
            <header className="flex items-center justify-between w-full p-3">
                <h1 className="w-[76px] h-[44px] bg-[url('/images/icon_logo.png')] bg-contain bg-no-repeat">
                    <Link className="size-full" href="/">
                        <span className="sr-only">책갈피</span>
                    </Link>
                </h1>

                {user ? (
                    <div className="flex items-center gap-2">
                        <span>{user.displayName}님</span>
                        <button onClick={handleLogout} className="ml-2 text-sm ">
                            로그아웃
                        </button>
                    </div>
                ) : (
                    <button onClick={handleOpenLoginModal}>로그인</button>
                )}
            </header>

            {isOpen && <LoginModal setIsOpen={setIsOpen} />}
        </>
    );
}
