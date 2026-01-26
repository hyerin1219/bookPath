'use client';

import LoginModal from '@/components/ui/loginModal';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import MenuLink from '@/components/ui/menuLink';
import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
    const { user, isOpen, handleLogout, setIsOpen, handleLogin, loading } = useAuth();
    const [open, setOpen] = useState(false);
    const handleOpenLoginModal = () => setIsOpen(true);
    const handleToggleMenu = () => setOpen((prev) => !prev);

    return (
        <>
            <header className="flex items-center justify-between w-full h-[55px] p-5 py-2">
                {/* 햄버거 버튼 */}
                <div className="flex items-start gap-2">
                    <button onClick={handleToggleMenu} className="p-2 cursor-pointer">
                        <img src="/images/icon_ham.png" className="w-6" />
                    </button>
                    <h1 className="w-[50px] h-[30px] bg-[url('/images/icon_logo.png')] bg-contain bg-no-repeat">
                        <Link className="size-full" href="/">
                            <span className="sr-only">책갈피</span>
                        </Link>
                    </h1>
                </div>

                {user ? (
                    <div>
                        <span>{user.displayName}님</span>
                        <button onClick={handleLogout} className="text-xs ml-2 cursor-pointer">
                            로그아웃
                        </button>
                    </div>
                ) : (
                    <button className="text-xs ml-2 cursor-pointer" onClick={handleOpenLoginModal}>
                        로그인
                    </button>
                )}

                {/* 사이드 메뉴 */}
                <AnimatePresence>
                    {open && (
                        <>
                            {/* 오버레이 */}
                            <motion.div className="fixed inset-0 bg-black/40 z-[400]" onClick={handleToggleMenu} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />

                            {/* 사이드 패널 */}
                            <motion.aside initial={{ x: -250 }} animate={{ x: 0 }} exit={{ x: -250 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }} className="fixed top-0 left-0 w-[250px] h-full bg-white shadow-xl p-5 py-2 z-500 flex flex-col gap-5">
                                {/* 메뉴 내부 햄버거 버튼(닫기 버튼) */}
                                <button onClick={handleToggleMenu} className="p-2 cursor-pointer">
                                    <img src="/images/icon_ham.png" className="w-6" />
                                </button>

                                <MenuLink onSelect={() => setOpen(false)} />
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>
            </header>

            {isOpen && <LoginModal setIsOpen={setIsOpen} handleLogin={handleLogin} loading={loading} />}
        </>
    );
}
