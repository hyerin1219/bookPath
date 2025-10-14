// components/ui/alert.tsx
'use client';
import { motion } from 'framer-motion';

interface AlertProps {
    message: string;
    onClose?: () => void;
}

export default function Alert({ message, onClose }: AlertProps) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="relative bg-white px-6 py-4 rounded-xl shadow-lg text-center">
                <p>{message}</p>
            </motion.div>
        </div>
    );
}
