'use client';

import { Button } from '@/components/ui/button';
import { IBookClubBoard } from '@/types/bookClubBoard';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFirestore, doc } from 'firebase/firestore/lite';
import { deleteDoc } from 'firebase/firestore/lite';

import { IBookPath } from '@/types/bookPath';

import { useAlert } from '@/hooks/useAlert';

import { firebaseApp } from '@/components/commons/libraries/firebase';

import DeleteModal from '@/components/ui/deleteModal';
import Alert from '@/components/ui/alert';
import HeartRating from '@/components/ui/rating';

interface IBookClubBoardDetailProps {
    board: IBookClubBoard;
    id: string;
}

export default function BookClubBoardDetail({ board, id }: IBookClubBoardDetailProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const { showAlert, alertValue, triggerAlert } = useAlert();
    const firestore = getFirestore(firebaseApp);

    // 삭제 모달
    const handleOpenDeleteModal = () => {
        setIsOpen(true);
    };

    // 삭제
    const handleDelete = async () => {
        try {
            const docRef = doc(firestore, 'bookClubBoard', id);
            await deleteDoc(docRef);
            setIsOpen(false);
            triggerAlert('삭제가 완료되었습니다!');
            setTimeout(() => {
                router.push(`/bookClub`);
            }, 2000);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="size-full">
            <div className="flex flex-col gap-5">
                <div className="w-full flex items-center gap-2 ">
                    <p>제목</p>
                    <div className="bg-[#eee] shadow-[inset_2px_2px_0px_rgba(0,0,0,0.3)] p-2 py-1 rounded-xl w-[90%]">{board.title}</div>
                </div>
                <div className="w-full flex  gap-2 ">
                    <p>내용</p>
                    <div className="min-h-30 bg-[#eee] shadow-[inset_2px_2px_0px_rgba(0,0,0,0.3)] p-2 py-1 rounded-xl w-[90%]">{board.content}</div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-5">
                    <Button onClick={() => router.push(`/bookClubBoardDetail/${id}/edit`)} variant="submit">
                        수정
                    </Button>
                    <Button onClick={handleDelete} variant="close">
                        삭제
                    </Button>
                </div>
            </div>

            {/* 알럿 */}
            {showAlert && <Alert alertValue={alertValue} />}
            {isOpen && <DeleteModal setIsOpen={setIsOpen} handleDelete={handleDelete} />}
        </div>
    );
}
