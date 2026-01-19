'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { IBookClub } from '@/types/bookClub';
import { IBookClubBoard } from '@/types/bookClubBoard';

export default function BookClubDetail({ bookClubData, bookClubBoard }: { bookClubData: IBookClub; bookClubBoard: IBookClubBoard[] }) {
    const router = useRouter();

    return (
        <div>
            <div>
                책갈피 모임 <span className="text-xl">{bookClubData.clubName}</span> 페이지
            </div>

            <div className="flex justify-end gap-5 mt-5">
                <div>{bookClubData.clubName} 모임 멤버</div>

                <div className="flex gpa-1">
                    {bookClubData.members.map((member) => (
                        <div key={member.user}>{member.nickname}</div>
                    ))}
                </div>
            </div>

            <div className="mt-5">
                {bookClubBoard.length > 0 ? (
                    bookClubBoard.map((el) => (
                        <div onClick={() => router.push(`/bookClubBoardDetail/${el.id}`)} key={el.id} className="flex justify-between border-b py-2 cursor-pointer">
                            <div>{el.title}</div>
                            <div>{el.nickname}</div>
                        </div>
                    ))
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
