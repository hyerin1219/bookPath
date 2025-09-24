'use client';

import Link from 'next/link';

import { motion, AnimatePresence } from 'framer-motion';
import { IBookItems } from '@/types/bookItems';

import { Button } from './button';
import { useRouter } from 'next/navigation';
import { BookItem02 } from './bookItem02';

interface IModalProps {
    selectedBook: IBookItems | null;
    setSelectedBook: (book: IBookItems | null) => void;
}

export default function Modal({ selectedBook, setSelectedBook }: IModalProps) {
    console.log(selectedBook);
    const router = useRouter();

    const handleWrite = () => {
        setSelectedBook(selectedBook); // 선택한 책 상태 저장
        router.push('/write'); // 독후감 페이지로 이동
        localStorage.setItem('selectedBook', JSON.stringify(selectedBook));
    };

    return (
        <AnimatePresence>
            {selectedBook && (
                <motion.div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 " initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <motion.div className="bg-white p-6 rounded-xl shadow-lg w-[400px] relative" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ duration: 0.3 }}>
                        {/* 이미지 */}
                        <BookItem02 className="w-55 h-85 mx-auto" el={selectedBook} />

                        {/* 제목 / 저자 */}
                        <div>
                            <h2 className="text-xl font-bold mb-2 mt-2">{selectedBook.title}</h2>
                            <p className="text-sm text-gray-600 mb-4">{selectedBook.author}</p>
                        </div>
                        {/* 설명 */}
                        <div className="h-[250px] overflow-y-auto ">
                            <p className="text-sm text-justify">{selectedBook.description || '설명이 없습니다.'}</p>
                        </div>
                        {/* 버튼 */}
                        <div className="flex justify-end items-center gap-3 mt-5">
                            <Button variant="submit" onClick={handleWrite}>
                                독후감 쓰기
                            </Button>
                            <Button>
                                <Link target="_blank" href={selectedBook.link}>
                                    네이버에서 보기
                                </Link>
                            </Button>
                            <Button variant="close" onClick={() => setSelectedBook(null)}>
                                닫기
                            </Button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
