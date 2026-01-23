'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFirestore, doc, deleteDoc, getDoc } from 'firebase/firestore/lite';

import { IBookPath } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/hooks/useAlert';
import { firebaseApp } from '@/components/commons/libraries/firebase';
import { Button } from '@/components/ui/button';
import DeleteModal from '@/components/ui/deleteModal';
import Alert from '@/components/ui/alert';
import HeartRating from '@/components/ui/rating';
import { BookItem02 } from '@/components/ui/bookItem02';

export default function DetailPage({ isbn }: { isbn: string }) {
    const { showAlert, alertValue, triggerAlert } = useAlert();
    const [isOpen, setIsOpen] = useState(false);
    const { uid } = useAuth();
    const [book, setBook] = useState<IBookPath | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const firestore = getFirestore(firebaseApp);

    // 데이터 불러오기
    useEffect(() => {
        if (!uid) return;

        const fetchBook = async () => {
            try {
                const docRef = doc(firestore, 'users', uid, 'books', isbn);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setBook({ id: docSnap.id, ...docSnap.data() } as unknown as IBookPath);
                }
            } catch (error) {
                console.error('데이터 로딩 실패:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [uid, isbn, firestore]);

    // 로딩 및 예외 처리
    if (loading) return <div className="flex justify-center py-20 font-medium">데이터를 불러오는 중...</div>;
    if (!book) return <div className="flex justify-center py-20 text-gray-500">책 정보를 찾을 수 없습니다.</div>;

    const handleEdit = () => {
        router.push(`/detail/${book.isbn}/edit`);
    };

    const handleDelete = async () => {
        if (!uid) return;
        try {
            const docRef = doc(firestore, 'users', uid, 'books', isbn);
            await deleteDoc(docRef);

            setIsOpen(false);
            triggerAlert('삭제가 완료되었습니다!');

            setTimeout(() => {
                router.push(`/myBookPath`);
                router.refresh(); // 목록 화면 새로고침 유도
            }, 2000);
        } catch (error) {
            console.error('삭제 오류:', error);
            triggerAlert('삭제에 실패했습니다.');
        }
    };

    return (
        <div className="size-full">
            <div className="w-full flex justify-center items-center gap-10">
                <BookItem02 className="flex-shrink-0 w-[150px] h-[213px]" scale={false} el={book} />

                <div className="flex flex-col gap-2 ">
                    <div className="text-lg">
                        <span className="font-bold text-xl mr-2">Title</span>
                        <span className="border-b-2 inline-block min-w-[150px]">{book.title}</span>
                    </div>
                    <div className="text-lg">
                        <span className="font-bold text-xl mr-2">Writer</span>
                        <span className="border-b-2 inline-block min-w-[150px]">{book.author || '-'}</span>
                    </div>
                    <div className="text-lg">
                        <span className="font-bold text-xl mr-2">Date</span>
                        <span className="border-b-2 inline-block min-w-[150px]">{book.date}</span>
                    </div>
                    <div className="inline-flex items-center">
                        <span className="font-bold text-xl mr-2">Rating</span>
                        <HeartRating heartValue={book.rating} readOnly />
                    </div>
                </div>
            </div>

            <div className="w-full h-130 bg-dot-grid mt-10 mb-5">
                <div className="p-2 size-full overflow-y-auto text-justify whitespace-pre-wrap leading-relaxed">{book.content}</div>
            </div>

            <div className="flex justify-end items-center gap-3">
                <Button onClick={() => router.push('/myBookPath')}>나의 책갈피 가기</Button>
                <Button onClick={handleEdit} variant="submit">
                    수정
                </Button>
                <Button onClick={() => setIsOpen(true)} variant="close">
                    삭제
                </Button>
            </div>

            {showAlert && <Alert alertValue={alertValue} />}
            {isOpen && <DeleteModal setIsOpen={setIsOpen} handleDelete={handleDelete} />}
        </div>
    );
}
