'use client';
import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { doc, getFirestore, setDoc } from 'firebase/firestore/lite';

import { IBookItems } from '@/types/bookItems';

import { BookItem02 } from '@/components/ui/bookItem02';
import { firebaseApp } from '@/components/commons/libraries/firebase';
import { Button } from '@/components/ui/button';
import Alert from '@/components/ui/alert';

import { useLoginCheck } from '@/hooks/useLoginCheck';

export default function Write() {
    const [book, setBook] = useState<IBookItems | null>(null);
    const [content, setContent] = useState('');

    const { showAlert } = useLoginCheck();

    const router = useRouter();

    const Today = new Date();

    useEffect(() => {
        const stored = localStorage.getItem('selectedBook');
        if (stored) setBook(JSON.parse(stored));
    }, []);

    // firebase 등록하기 기능
    const handleSubmit = async (book: IBookItems): Promise<void> => {
        if (!book) return;
        // if (!userData) {
        //     return;
        // }

        try {
            const firestore = getFirestore(firebaseApp);
            // const bookPath = collection(getFirestore(firebaseApp), 'bookPath');
            await setDoc(doc(firestore, 'bookPath', book.isbn), {
                id: book.isbn,
                writer: book.author,
                img: book.image,
                title: book.title,
                content,
            });

            setContent('');
            router.push(`/detail/${book.isbn}`);
        } catch (error) {
            if (error instanceof Error) alert(error.message);
        }
    };

    if (!book) return <p>책이 선택되지 않았습니다.</p>;

    return (
        <div className="size-full text-right">
            {/* 책 정보 */}
            <div className="w-full flex justify-center items-center gap-10">
                <BookItem02 className="flex-shrink-0 w-[150px] h-[213px]" el={book} />
                <div className="flex flex-col gap-2 text-left">
                    <div>
                        <span className="font-bold text-xl">Title</span> <span className="border-b-2">{book.title}</span>
                    </div>
                    <div>
                        <span className="font-bold text-xl">Writer</span> <span className="border-b-2">{book.author}</span>
                    </div>
                    <div>
                        <span className="font-bold text-xl">Date</span> <span className="border-b-2">{Today.toLocaleDateString()}</span>
                    </div>
                    <div className="inline-flex ">
                        <span className="font-bold text-xl mr-1">Rating</span>
                        <p>
                            <button className="w-7 h-7 bg-[url('/images/write/icon_rating.png')] bg-contain bg-no-repeat"></button>
                        </p>
                    </div>
                </div>
            </div>

            {/* 입력 칸 */}
            <div className="w-full h-130  bg-[url('/images/write/bg_grid.png')] bg-cover bg-no-repeat  mt-10 mb-5">
                <textarea spellCheck="false" value={content} onChange={(e) => setContent(e.target.value)} className="size-full resize-none p-2" name="" id=""></textarea>
            </div>

            <Button onClick={() => handleSubmit(book!)} variant="submit">
                등록
            </Button>

            {showAlert && <Alert message="로그인 후 이용해주세요!" />}
        </div>
    );
}
