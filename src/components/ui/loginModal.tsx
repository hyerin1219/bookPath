'use client';

import { motion } from 'framer-motion';
import { Button } from './button';

interface LoginModalProps {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleLogin: () => Promise<void>;
    loading: boolean;
}

export default function LoginModal({ setIsOpen, handleLogin, loading }: LoginModalProps) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="relative flex flex-col items-center gap-5 bg-white p-10 py-5 rounded-xl shadow-[2px_2px_6px_rgba(0,0,0,0.1)]">
                <button onClick={handleLogin} disabled={loading} className={`text-[0px] w-[189px] h-[40px] bg-[url('/images/button_login.png')] bg-contain bg-no-repeat ${loading && 'opacity-50 cursor-none'}`}>
                    Google 로그인
                </button>
                <Button variant="close" onClick={() => setIsOpen(false)} className="">
                    닫기
                </Button>
            </motion.div>
        </div>
    );
}
