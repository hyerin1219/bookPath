import { motion, AnimatePresence } from 'framer-motion';
import { IBookItems } from '@/types/bookItems';

interface IModalProps {
    selectedBook: IBookItems | null;
    setSelectedBook: (book: IBookItems | null) => void;
}

export default function Modal({ selectedBook, setSelectedBook }: IModalProps) {
    return (
        <AnimatePresence>
            {selectedBook && (
                <motion.div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 " initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.div className="bg-white p-6 rounded-xl shadow-lg w-[400px] relative" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.3 }}>
                        <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={() => setSelectedBook(null)}>
                            ✕
                        </button>
                        <img src={selectedBook.image} alt={selectedBook.title} className="w-full h-80 object-contain mb-4" />
                        <h2 className="text-xl font-bold mb-2">{selectedBook.title}</h2>
                        <p className="text-sm text-gray-600 mb-4">{selectedBook.author}</p>
                        <div className="h-[250px] overflow-y-auto ">
                            <p className="text-sm text-justify">{selectedBook.description || '설명이 없습니다.'}</p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
