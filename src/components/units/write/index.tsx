'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getFirestore, setDoc, updateDoc } from 'firebase/firestore/lite';

import { IBookItems } from '@/types/bookItems';

import { BookItem02 } from '@/components/ui/bookItem02';
import { firebaseApp } from '@/components/commons/libraries/firebase';
import { Button } from '@/components/ui/button';
import Alert from '@/components/ui/alert';

import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/hooks/useAlert';
import HeartRating from '@/components/ui/rating';
import Rating from '@mui/material/Rating';

interface WriteProps {
    mode: 'submit' | 'edit';
    book?: IBookItems;
}

export default function Write({ mode, book: initialBook }: WriteProps) {
    const [book, setBook] = useState<IBookItems | null>(initialBook || null);
    const [content, setContent] = useState('');
    const [heartValue, setHeartValue] = useState(0);
    const { showAlert, alertValue, triggerAlert } = useAlert();
    const { uid } = useAuth();
    const router = useRouter();
    const firestore = getFirestore(firebaseApp);

    useEffect(() => {
        if (uid === null) {
            triggerAlert('로그인 후 이용해주세요!');
            setTimeout(() => {
                router.push('/');
            }, 2000);
        }
    }, [uid]);

    useEffect(() => {
        if (!book && mode === 'submit') {
            const stored = localStorage.getItem('selectedBook');
            if (stored) {
                const parsed = JSON.parse(stored);
                setBook(parsed);
                setContent(parsed.content || '');
            }
        }

        if (book && mode === 'edit') {
            setContent(book.content || '');
        }
    }, [book, mode]);

    // 등록
    const handleSubmit = async () => {
        if (!book) return;
        if (!content.trim()) {
            triggerAlert('내용을 입력해주세요!');
            return;
        }
        try {
            const docRef = doc(firestore, 'bookPath', book.isbn);
            await setDoc(docRef, {
                uid,
                isbn: book.isbn,
                author: book.author,
                image: book.image,
                title: book.title,
                content,
                date: new Date().toLocaleDateString(),
                rating: heartValue,
            });
            router.push(`/detail/${book.isbn}`);
        } catch (error) {
            if (error instanceof Error) alert(error.message);
        }
    };

    // 수정
    const handleEdit = async () => {
        if (!book) return;
        try {
            const docRef = doc(firestore, 'bookPath', book.isbn);
            await updateDoc(docRef, { content, rating: heartValue });
            triggerAlert('수정이 완료되었습니다!');
            setTimeout(() => {
                router.push(`/detail/${book.isbn}`);
            }, 2000);
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
                        <span className="font-bold text-xl">Date</span> <span className="border-b-2">{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="inline-flex ">
                        <span className="font-bold text-xl mr-1">Rating</span>
                        <HeartRating heartValue={heartValue} setHeartValue={setHeartValue} />
                    </div>
                </div>
            </div>

            {/* 입력 칸 */}
            <div className="w-full h-130 bg-[url('/images/write/bg_grid.png')] bg-cover bg-no-repeat mt-10 mb-5">
                <textarea spellCheck="false" value={content} onChange={(e) => setContent(e.target.value)} className="size-full resize-none p-2" />
            </div>

            <Button onClick={mode === 'submit' ? handleSubmit : handleEdit} variant="submit">
                {mode === 'submit' ? '등록' : '수정'}
            </Button>

            {/* 알럿 */}
            {showAlert && <Alert alertValue={alertValue} />}
        </div>
    );
}
