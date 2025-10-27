'use client';
import { Button } from '@/components/ui/button';
import { IBookClub } from '@/types/bookClub';
import { IBookClubBoard } from '@/types/bookClubBoard';
import { useRouter, useSearchParams } from 'next/navigation';

import { useEffect } from 'react';

export default function BookClubDetail({ bookClubData, bookClubBoard }: { bookClubData: IBookClub; bookClubBoard: IBookClubBoard[] }) {
    // useEffect(() => {
    //     console.log('클라이언트에서 받은 데이터:', bookClubData);
    // }, [bookClubData]);

    const searchParams = useSearchParams();
    const clubId = searchParams.get('clubId');

    const router = useRouter();

    return (
        <div>
            <div>
                책갈피 모임 <span className="text-xl">{bookClubData.clubName}</span> 페이지
            </div>

            <div className="flex gap-5 mt-5">
                <div>{bookClubData.clubName} 모임 멤버</div>

                <div className="flex gpa-1">
                    {bookClubData.members.map((member) => (
                        <div key={member.user}>{member.nickname}</div>
                    ))}
                </div>
            </div>

            <div className="mt-5">
                {bookClubData.id === clubId ? (
                    bookClubBoard.length > 0 ? (
                        bookClubBoard.map((el) => (
                            <div key={el.id} className="border-b py-2">
                                <div className="font-bold">{el.title}</div>
                                {/* <div>{el.content}</div> */}
                            </div>
                        ))
                    ) : (
                        <div>등록된 게시글이 없습니다.</div>
                    )
                ) : (
                    <div>등록된 게시글이 없습니다.</div>
                )}
            </div>

            <Button onClick={() => router.push(`/bookClubWrite?clubId=${bookClubData.id}`)} className="mt-5">
                글쓰기
            </Button>
        </div>
    );
}
