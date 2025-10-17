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

interface WriteProps {
    mode: 'submit' | 'edit';
    book?: IBookItems; // edit 모드에서는 필수
}

export default function Write({ mode, book: initialBook }: WriteProps) {
    const [book, setBook] = useState<IBookItems | null>(initialBook || null);
    const [content, setContent] = useState('');
    const [editSuccess, seEditSuccess] = useState(false);
    const { uid } = useAuth();
    const router = useRouter();
    const firestore = getFirestore(firebaseApp);

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
        try {
            const docRef = doc(firestore, 'bookPath', book.isbn);
            await setDoc(docRef, {
                uid,
                isbn: book.isbn,
                writer: book.author,
                image: book.image,
                title: book.title,
                content,
                date: new Date().toLocaleDateString(),
            });
            router.push(`/detail/${book.isbn}`);
        } catch (error) {
            if (error instanceof Error) alert(error.message);
        }
    };

    // 수정
    const handleEdit = async () => {
        console.log('수정모드', book);
        if (!book) return;
        try {
            const docRef = doc(firestore, 'bookPath', book.isbn);
            await updateDoc(docRef, { content });
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
                        <p>
                            <button className="w-7 h-7 bg-[url('/images/write/icon_rating.png')] bg-contain bg-no-repeat"></button>
                        </p>
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
            {!uid && <Alert message="로그인 후 이용해주세요!" />}
            {editSuccess && <Alert message="수정이 완료되었습니다!" />}
        </div>
    );
}
