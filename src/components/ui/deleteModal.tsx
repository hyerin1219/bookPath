'use client';

import { motion } from 'framer-motion';
import { Button } from './button';

interface LoginModalProps {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    handleDelete(): Promise<void>;
}

export default function DeleteModal({ setIsOpen, handleDelete }: LoginModalProps) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="relative flex flex-col items-center gap-5 bg-white p-10 py-5 rounded-xl shadow-[2px_2px_6px_rgba(0,0,0,0.1)]">
                <p>정말 삭제하시겠습니까?</p>
                <div className="flex gap-5">
                    <Button variant="submit" onClick={handleDelete} className="">
                        확인
                    </Button>
                    <Button variant="close" onClick={() => setIsOpen(false)} className="">
                        닫기
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
