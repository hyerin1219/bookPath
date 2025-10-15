'use client';

import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

interface LoginModalProps {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LoginModal({ setIsOpen }: LoginModalProps) {
    const { handleLogin } = useAuth();

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="relative bg-white p-10 py-5 rounded-xl shadow-[2px_2px_6px_rgba(0,0,0,0.1)]">
                <button onClick={handleLogin} className="">
                    구글 로그인
                </button>
                <button onClick={() => setIsOpen(false)} className="absolute top-[5px] right-[5px] w-[25px] h-[25px] bg-[url('/images/button_close.png')] bg-contain bg-no-repeat"></button>
            </motion.div>
        </div>
    );
}
