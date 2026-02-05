'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFirestore, doc, deleteDoc, getDoc } from 'firebase/firestore';

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

    // 수정하기
    const handleEdit = () => {
        router.push(`/detail/${book?.isbn}/edit`);
    };

    // 독후감 삭제하기
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
            {/* 상단 정보 영역 */}
            <div className="w-full flex justify-center items-center gap-10">
                {loading ? <div className="w-[150px] h-[213px] bg-gray-200 animate-pulse rounded-lg" /> : book && <BookItem02 className="flex-shrink-0 w-[150px] h-[213px]" scale={false} el={book} />}

                <div className="flex flex-col gap-2 ">
                    <div className="text-lg">
                        <span className="font-bold text-xl mr-2">Title</span>
                        <span className="border-b-2 inline-block ">{book?.title}</span>
                    </div>
                    <div className="text-lg">
                        <span className="font-bold text-xl mr-2">Writer</span>
                        <span className="border-b-2 inline-block ">{book?.author}</span>
                    </div>
                    <div className="text-lg">
                        <span className="font-bold text-xl mr-2">Date</span>
                        <span className="border-b-2 inline-block ">{book?.date}</span>
                    </div>

                    <div className="inline-flex items-center">
                        <span className="font-bold text-xl mr-2">Rating</span>
                        {loading ? <div className="w-20 h-5 bg-gray-100 animate-pulse" /> : <HeartRating heartValue={book?.rating || 0} readOnly />}
                    </div>
                </div>
            </div>

            {/* 본문 영역 */}
            <div className="w-full h-130 bg-dot-grid mt-10 mb-5">
                <div className="p-2 size-full overflow-y-auto text-justify whitespace-pre-wrap leading-relaxed">
                    {loading ? (
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-100 w-full animate-pulse" />
                            <div className="h-4 bg-gray-100 w-5/6 animate-pulse" />
                        </div>
                    ) : (
                        book?.content || '내용이 없습니다.'
                    )}
                </div>
            </div>

            {/* 하단 버튼 */}
            <div className="flex justify-end items-center gap-3">
                <Button onClick={() => router.push('/myBookPath')}>나의 책갈피 가기</Button>
                <Button onClick={handleEdit} variant="submit" disabled={loading}>
                    수정
                </Button>
                <Button onClick={() => setIsOpen(true)} variant="close" disabled={loading}>
                    삭제
                </Button>
            </div>

            {showAlert && <Alert alertValue={alertValue} />}
            {isOpen && <DeleteModal setIsOpen={setIsOpen} handleDelete={handleDelete} />}
        </div>
    );
}
