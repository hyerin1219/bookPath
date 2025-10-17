'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface AlertProps {
    message: string;
}

export default function Alert({ message }: AlertProps) {
    const [visible, setVisible] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            router.push('/');
        }, 2000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <AnimatePresence>
            {visible && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="relative bg-white px-6 py-4 rounded-xl shadow-lg text-center">
                        <p>{message}</p>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
