'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getFirestore, setDoc, updateDoc, getDoc } from 'firebase/firestore/lite';

import { IBookItems, IBookPath } from '@/types'; // 타입 추가 확인 필요
import { firebaseApp } from '@/components/commons/libraries/firebase';
import { Button } from '@/components/ui/button';
import Alert from '@/components/ui/alert';
import { BookItem02 } from '@/components/ui/bookItem02';
import HeartRating from '@/components/ui/rating';

import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/hooks/useAlert';
import Refine from '@/components/ui/ai';

interface WriteProps {
    mode: 'submit' | 'edit';
    isbn?: string; // 수정 모드를 위해 isbn 추가
    book?: IBookItems; // 등록 모드를 위해 검색 결과 book 추가
}

export default function Write({ mode, isbn, book: initialBook }: WriteProps) {
    const [book, setBook] = useState<IBookPath | IBookItems | null>(initialBook || null);
    const [content, setContent] = useState('');
    const [heartValue, setHeartValue] = useState(0);
    const [isRestoring, setIsRestoring] = useState(true); // 복구 중인지 확인하는 상태
    const { uid } = useAuth();
    const router = useRouter();
    const firestore = getFirestore(firebaseApp);
    const { showAlert, alertValue, triggerAlert } = useAlert();

    // 1. 인증 체크
    useEffect(() => {
        if (uid === null) {
            triggerAlert('로그인 후 이용해주세요!');
            setTimeout(() => router.push('/'), 2000);
        }
    }, [uid, router, triggerAlert]);

    // 2. 등록 모드일 때 localStorage에서 데이터 꺼내오기
    useEffect(() => {
        if (mode === 'submit' && !book) {
            const saved = localStorage.getItem('selectedBook');
            if (saved) {
                setBook(JSON.parse(saved));
            }
        }
        setIsRestoring(false); // 데이터 체크가 끝나면 로딩 해제
    }, [mode, book]);

    // 3. 수정 모드일 때 데이터 불러오기 및 폼 채우기
    useEffect(() => {
        if (mode === 'edit' && uid && isbn) {
            const fetchEditData = async () => {
                const docRef = doc(firestore, 'users', uid, 'books', isbn);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data() as IBookPath;
                    setBook(data);
                    setContent(data.content); // 기존 내용 세팅
                    setHeartValue(data.rating); // 기존 별점 세팅
                }
            };
            fetchEditData();
        }
    }, [mode, uid, isbn, firestore]);

    // 등록 로직
    const handleSubmit = async () => {
        if (!book || !uid) return;

        try {
            const docRef = doc(firestore, 'users', uid, 'books', book.isbn);
            if (!content.trim()) return triggerAlert('내용을 입력해주세요!');
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                // 이미 데이터가 있다면 알럿
                return triggerAlert('이미 서재에 등록된 책입니다!');
            }
            await setDoc(docRef, {
                uid,
                isbn: book.isbn,
                author: book.author,
                image: book.image,
                title: book.title,
                content,
                date: new Date().toLocaleDateString(),
                rating: heartValue,
                description: book.description || '',
                publisher: book.publisher || '',
            });
            router.push(`/detail/${book.isbn}`);
        } catch (error) {
            console.error(error);
        }
    };

    // 수정 로직
    const handleEdit = async () => {
        if (!book || !uid) return;
        try {
            const docRef = doc(firestore, 'users', uid, 'books', book.isbn);
            await updateDoc(docRef, {
                content,
                rating: heartValue,
                date: `${new Date().toLocaleDateString()} (수정됨)`,
            });

            triggerAlert('수정이 완료되었습니다!');
            setTimeout(() => router.push(`/detail/${book.isbn}`), 2000);
        } catch (error) {
            console.error(error);
        }
    };

    if (!book) return <p className="text-center py-20 text-gray-500">데이터를 불러오는 중입니다...</p>;

    return (
        <div className="size-full text-right">
            {/* 책 정보 영역 */}
            <div className="w-full flex justify-center items-center gap-10">
                <BookItem02 scale={false} className="flex-shrink-0 w-[150px] h-[213px]" el={book} />

                <div className="flex flex-col gap-2 text-left">
                    <div>
                        <span className="font-bold text-xl">Title</span> <span className="border-b-2">{book.title}</span>
                    </div>
                    <div>
                        <span className="font-bold text-xl">Writer</span> <span className="border-b-2">{book.author}</span>
                    </div>
                    <div>
                        <span className="font-bold text-xl">Date</span>
                        <span className="border-b-2">{(book as IBookPath).date || new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="inline-flex items-center">
                        <span className="font-bold text-xl mr-1">Rating</span>
                        <HeartRating heartValue={heartValue} setHeartValue={setHeartValue} />
                    </div>
                </div>
            </div>

            {/* 문장 교정 */}
            <Refine value={content} onChange={(e) => setContent(e.target.value)} />

            {/* 버튼 */}
            <Button onClick={mode === 'submit' ? handleSubmit : handleEdit} variant="submit">
                {mode === 'submit' ? '등록' : '수정'}
            </Button>

            {/* 알럿 */}
            {showAlert && <Alert alertValue={alertValue} />}
        </div>
    );
}
