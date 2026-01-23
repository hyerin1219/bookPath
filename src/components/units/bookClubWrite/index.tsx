'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { collection, getFirestore, addDoc, updateDoc, doc } from 'firebase/firestore';
import { firebaseApp } from '@/components/commons/libraries/firebase';

import Alert from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useAlert } from '@/hooks/useAlert';
import { useAuth } from '@/hooks/useAuth';
import { IBookClubBoard } from '@/types';
import { getDoc } from 'firebase/firestore/lite';

interface IBookClubWriteProps {
    mode: 'submit' | 'edit';
    id?: string;
}

export default function BookClubWrite({ mode, id }: IBookClubWriteProps) {
    const firestore = getFirestore(firebaseApp);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(mode === 'edit'); // 수정 모드 시 로딩 상태 관리

    const { showAlert, alertValue, triggerAlert } = useAlert();
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const clubId = searchParams.get('clubId');

    // [수정] 수정 모드일 때 서버 데이터 페칭
    useEffect(() => {
        if (mode === 'edit' && id) {
            const fetchPost = async () => {
                try {
                    const docRef = doc(firestore, 'bookClubBoard', id);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data() as IBookClubBoard;
                        setTitle(data.title);
                        setContent(data.content);
                    } else {
                        triggerAlert('게시글을 찾을 수 없습니다.');
                    }
                } catch (error) {
                    console.error('데이터 로딩 실패:', error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchPost();
        }
    }, [mode, id, firestore]);

    // 수정 로직 (id 직접 사용)
    const handleUpdatePost = async () => {
        if (!id) return;
        try {
            const docRef = doc(firestore, 'bookClubBoard', id);
            await updateDoc(docRef, {
                title,
                content,
                updatedAt: new Date().toLocaleDateString(), // 수정일자 관리 권장
            });

            triggerAlert('게시글이 수정되었습니다!');
            setTimeout(() => {
                router.push(`/bookClubBoardDetail/${id}`);
            }, 2000);
        } catch (error) {
            if (error instanceof Error) alert(error.message);
        }
    };

    // 등록
    const handleSubmitPost = async () => {
        try {
            const docRef = await addDoc(collection(firestore, 'bookClubBoard'), {
                title,
                content,
                clubId,
                nickname: user?.displayName || '익명',
                userId: user?.uid,
                date: new Date().toLocaleDateString(),
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
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-white shadow p-2 rounded-lg w-[90%] border border-[#A8E6CF]" />
                </div>

                <div className="w-full flex gap-2">
                    <p>내용</p>
                    <textarea spellCheck="false" rows={15} value={content} onChange={(e) => setContent(e.target.value)} className="min-h-[250px] bg-white shadow p-2 rounded-lg w-[90%] custom-scroll border border-[#A8E6CF] text-justify" />
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
