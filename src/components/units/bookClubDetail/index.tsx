'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFirestore, doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { firebaseApp } from '@/components/commons/libraries/firebase';

import { Button } from '@/components/ui/button';
import { IBookClub, IBookClubBoard } from '@/types';

export default function BookClubDetail({ id }: { id: string }) {
    const router = useRouter();
    const firestore = getFirestore(firebaseApp);

    const [bookClubData, setBookClubData] = useState<IBookClub | null>(null);
    const [bookClubBoard, setBookClubBoard] = useState<IBookClubBoard[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setIsLoading(true);

                const docRef = doc(firestore, 'bookClub', id);
                const boardColRef = collection(firestore, 'bookClubBoard');
                const q = query(boardColRef, where('clubId', '==', id));

                const [docSnap, querySnapshot] = await Promise.all([getDoc(docRef), getDocs(q)]);

                if (docSnap.exists()) {
                    setBookClubData({
                        id: docSnap.id,
                        ...docSnap.data(),
                    } as IBookClub);
                }

                // 게시판 목록
                const boards = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...(doc.data() as Omit<IBookClubBoard, 'id'>),
                }));
                setBookClubBoard(boards);
            } catch (error) {
                console.error('데이터 패칭 에러:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllData();
    }, [id, firestore]);

    // 로딩 중 및 예외 처리
    if (isLoading) return <div className="p-10">정보를 불러오는 중입니다...</div>;
    if (!bookClubData) return <div className="p-10">데이터를 찾을 수 없습니다.</div>;

    return (
        <div>
            {/* 책갈피 모임 이름 */}
            <div>
                책갈피 모임 <span className="text-xl font-bold">{bookClubData.clubName}</span> 페이지
            </div>

            {/* 책갈피 모임 멤버 */}
            <div className="flex justify-end gap-5 mt-5">
                <div>{bookClubData.clubName} 멤버</div>
                <div className="flex gap-2">
                    {bookClubData.members?.map((member) => (
                        <div key={member.user} className="">
                            {member.nickname}
                        </div>
                    ))}
                </div>
            </div>

            {/* 책갈피 게시글 */}
            <div className="mt-5 ">
                {bookClubBoard.length > 0 ? (
                    bookClubBoard.map((el) => (
                        <div key={el.id} onClick={() => router.push(`/bookClubBoardDetail/${el.id}`)} className="flex justify-between items-center p-3 px-5 mb-3 bg-white rounded-xl shadow cursor-pointer  transition-all hover:bg-gray-50">
                            <div className="truncate  w-[70%]">{el.title}</div>
                            <div className=" w-[90px]">
                                <div className="text-sm ">{el.nickname}</div>
                                <span className="inline-block text-gray-500 text-sm">{el.date}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-10 text-center text-gray-400">등록된 게시글이 없습니다.</div>
                )}
            </div>

            {/* 버튼 */}
            <div className="flex items-center justify-end gap-5 mt-5 ">
                <Button variant="submit" onClick={() => router.push(`/bookClubWrite?clubId=${id}`)}>
                    글쓰기
                </Button>
                <Button onClick={() => router.push(`/bookClub`)}>책갈피 모임 가기</Button>
            </div>
        </div>
    );
}
