'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { collection, getFirestore, addDoc, updateDoc, doc } from 'firebase/firestore';
import { firebaseApp } from '@/components/commons/libraries/firebase';

import Alert from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useAlert } from '@/hooks/useAlert';
import { useAuth } from '@/hooks/useAuth';
import { IBookClubBoard } from '@/types/bookClubBoard';

interface IBookClubWriteProps {
    mode: 'submit' | 'edit';
    bookClubBoardData?: IBookClubBoard;
}

export default function BookClubWrite({ mode, bookClubBoardData }: IBookClubWriteProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const { showAlert, alertValue, triggerAlert } = useAlert();
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const clubId = searchParams.get('clubId');

    const firestore = getFirestore(firebaseApp);

    // 수정 모드면 기존 데이터로 초기화
    useEffect(() => {
        if (mode === 'edit' && bookClubBoardData) {
            setTitle(bookClubBoardData.title);
            setContent(bookClubBoardData.content);
        }
    }, [mode, bookClubBoardData]);

    // 등록
    const handleSubmitPost = async () => {
        try {
            const docRef = await addDoc(collection(firestore, 'bookClubBoard'), {
                title,
                content,
                clubId,
                nickname: user?.displayName || '익명',
            });
            await updateDoc(docRef, { id: docRef.id });

            setTitle('');
            setContent('');
            triggerAlert('게시글이 등록되었습니다!');
            setTimeout(() => {
                router.push(`/bookClubBoardDetail/${docRef.id}`);
            }, 2000);
        } catch (error) {
            if (error instanceof Error) alert(error.message);
        }
    };

    // 수정
    const handleUpdatePost = async () => {
        if (!bookClubBoardData?.id) return;

        try {
            const docRef = doc(firestore, 'bookClubBoard', bookClubBoardData.id);
            await updateDoc(docRef, {
                title,
                content,
            });

            triggerAlert('게시글이 수정되었습니다!');
            setTimeout(() => {
                router.push(`/bookClubBoardDetail/${docRef.id}`);
            }, 2000);
        } catch (error) {
            if (error instanceof Error) alert(error.message);
        }
    };

    // 공통 submit 핸들러
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return triggerAlert('제목을 입력해주세요!');
        if (!content.trim()) return triggerAlert('내용을 입력해주세요!');

        mode === 'edit' ? handleUpdatePost() : handleSubmitPost();
    };

    return (
        <div className="size-full">
            <div className="mb-5 text-xl">{mode === 'submit' ? '게시글 등록하기' : '게시글 수정하기'}</div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="w-full flex items-center gap-2">
                    <p>제목</p>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-[#eee] shadow-[inset_2px_2px_0px_rgba(0,0,0,0.3)] p-2 rounded-xl w-[90%]" />
                </div>

                <div className="w-full flex gap-2">
                    <p>내용</p>
                    <textarea spellCheck="false" rows={15} value={content} onChange={(e) => setContent(e.target.value)} className="min-h-[200px] bg-[#eee] shadow-[inset_2px_2px_0px_rgba(0,0,0,0.3)] p-2 rounded-xl w-[90%] custom-scroll" />
                </div>

                <div className="text-right">
                    <Button type="submit" variant="submit" className="mt-5">
                        {mode === 'submit' ? '등록' : '수정'}
                    </Button>
                </div>
            </form>

            {showAlert && <Alert alertValue={alertValue} />}
        </div>
    );
}
