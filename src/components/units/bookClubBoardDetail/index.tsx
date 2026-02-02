'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFirestore, doc, getDoc, deleteDoc } from 'firebase/firestore'; // 일반 firestore 권장

import { firebaseApp } from '@/components/commons/libraries/firebase';
import DeleteModal from '@/components/ui/deleteModal';
import Alert from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { IBookClubBoard } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/hooks/useAlert';

interface IBookClubBoardDetailProps {
    id: string; // 이제 board를 prop으로 받지 않고 id만 받습니다.
}

export default function BookClubBoardDetail({ id }: IBookClubBoardDetailProps) {
    const router = useRouter();
    const { uid } = useAuth();
    const { showAlert, alertValue, triggerAlert } = useAlert();

    const [board, setBoard] = useState<IBookClubBoard | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    const firestore = getFirestore(firebaseApp);

    const docRef = doc(firestore, 'bookClubBoard', id);

    useEffect(() => {
        const fetchBoard = async () => {
            try {
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setBoard({
                        id: docSnap.id,
                        ...(docSnap.data() as Omit<IBookClubBoard, 'id'>),
                    });
                }
            } catch (error) {
                console.error('데이터 로딩 실패:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBoard();
    }, [id, firestore]);

    // 2. 삭제 로직
    const handleDelete = async () => {
        try {
            await deleteDoc(docRef);
            setIsOpen(false);
            triggerAlert('삭제가 완료되었습니다!');
            setTimeout(() => router.push(`/bookClub`), 2000);
        } catch (error) {
            console.error(error);
        }
    };

    const isMine = uid === board?.userId;

    return (
        <div className="size-full">
            <div className="flex flex-col gap-5">
                {/* 제목 영역 */}
                <div className="w-full flex items-center gap-2">
                    <p className="shrink-0 w-10">제목</p>
                    <div className="bg-white shadow p-2 rounded-lg w-[90%] border border-[#A8E6CF] min-h-[42px]">{isLoading ? <div className="h-6 w-1/2 bg-gray-100 animate-pulse rounded" /> : board?.title}</div>
                </div>

                {/* 내용 영역 */}
                <div className="w-full flex gap-2">
                    <p className="shrink-0 w-10">내용</p>
                    <div className="min-h-[250px] bg-white shadow p-2 rounded-lg w-[90%] border border-[#A8E6CF] text-justify overflow-y-auto custom-scroll whitespace-pre-wrap break-all">
                        {isLoading ? (
                            <div className="space-y-3">
                                <div className="h-4 bg-gray-100 w-full animate-pulse rounded" />
                                <div className="h-4 bg-gray-100 w-4/5 animate-pulse rounded" />
                                <div className="h-4 bg-gray-100 w-full animate-pulse rounded" />
                            </div>
                        ) : (
                            board?.content || '게시글을 찾을 수 없습니다.'
                        )}
                    </div>
                </div>

                {/* 하단 버튼 영역 */}
                <div className="flex items-center justify-end gap-3 mt-5">
                    <Button onClick={() => router.push(`/bookClubDetail/${board?.clubId}`)}>나의 책갈피 모임 가기</Button>

                    {!isLoading && isMine && (
                        <div className="flex items-center justify-end gap-3 ">
                            <Button onClick={() => router.push(`/bookClubBoardDetail/${id}/edit`)} variant="submit">
                                수정
                            </Button>
                            <Button onClick={() => setIsOpen(true)} variant="close">
                                삭제
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* 알럿 및 모달 */}
            {showAlert && <Alert alertValue={alertValue} />}
            {isOpen && <DeleteModal setIsOpen={setIsOpen} handleDelete={handleDelete} />}
        </div>
    );
}
