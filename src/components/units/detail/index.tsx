'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFirestore, doc } from 'firebase/firestore/lite';
import { deleteDoc } from 'firebase/firestore/lite';

import { IBookPath } from '@/types/bookPath';

import { useAlert } from '@/hooks/useAlert';

import { firebaseApp } from '@/components/commons/libraries/firebase';
import { Button } from '@/components/ui/button';
import DeleteModal from '@/components/ui/deleteModal';
import Alert from '@/components/ui/alert';
import HeartRating from '@/components/ui/rating';

interface DetailPageProps {
    book: IBookPath;
}

export default function DetailPage({ book }: DetailPageProps) {
    const { showAlert, alertValue, triggerAlert } = useAlert();
    const [isOpen, setIsOpen] = useState(false);

    const router = useRouter();
    const firestore = getFirestore(firebaseApp);

    if (!book) return <p>로딩중...</p>;

    // 수정
    const handleEdit = () => {
        router.push(`/detail/${book.isbn}/edit`);
    };

    // 삭제 모달
    const handleOpenDeleteModal = () => {
        setIsOpen(true);
    };

    // 삭제
    const handleDelete = async () => {
        try {
            const docRef = doc(firestore, 'bookPath', book.isbn);
            await deleteDoc(docRef);
            setIsOpen(false);
            triggerAlert('삭제가 완료되었습니다!');
            setTimeout(() => {
                router.push(`/myBookPath`);
            }, 2000);
        } catch (error) {
            console.error(error);
        }
    };

    // 뒤로 가기
    const handleOpenMyBookPath = () => {
        router.push(`/myBookPath`);
    };

    return (
        <div className="size-full ">
            {/* 책 정보 */}
            <div className="w-full flex justify-center items-center gap-10">
                <div
                    className="flex-shrink-0 w-[150px] h-[213px] rounded-md bg-white border border-[rgba(0,0,0,0.3)] 
                            shadow-[inset_-4px_-4px_0px_rgba(0,0,0,0.3)] overflow-hidden"
                >
                    <img className="w-[calc(100%-4px)] h-[calc(100%-4px)] object-cover rounded-[5px_2px_5px_2px]" src={book.image} alt={`${book.title} 표지`} />
                </div>
                <div className="flex flex-col gap-2 text-left">
                    <div>
                        <span className="font-bold text-xl">Title</span> <span className="border-b-2">{book.title}</span>
                    </div>
                    <div>
                        <span className="font-bold text-xl">Writer</span> <span className="border-b-2">{book.author ? book.author : '-'}</span>
                    </div>
                    <div>
                        <span className="font-bold text-xl">Date</span> <span className="border-b-2">{book.date}</span>
                    </div>
                    <div className="inline-flex ">
                        <span className="font-bold text-xl mr-1">Rating</span>

                        <HeartRating heartValue={book.rating} readOnly />
                    </div>
                </div>
            </div>

            {/* 입력 칸 */}
            <div className="w-full h-130 bg-[url('/images/write/bg_grid.png')] bg-cover bg-no-repeat  mt-10 mb-5">
                <div className="p-2 size-full overflow-y-auto text-justify">{book.content}</div>
            </div>

            <div className="flex justify-end items-center gap-3">
                <Button onClick={handleOpenMyBookPath}>나의 책갈피 가기</Button>
                <Button onClick={handleEdit} variant="submit">
                    수정
                </Button>
                <Button onClick={handleOpenDeleteModal} variant="close">
                    삭제
                </Button>
            </div>

            {/* 알럿 */}
            {showAlert && <Alert alertValue={alertValue} />}
            {isOpen && <DeleteModal setIsOpen={setIsOpen} handleDelete={handleDelete} />}
        </div>
    );
}
