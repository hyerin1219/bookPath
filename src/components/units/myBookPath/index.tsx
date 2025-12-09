'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { BookItem02 } from '@/components/ui/bookItem02';
import Alert from '@/components/ui/alert';

import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/hooks/useAlert';
import HeartRating from '@/components/ui/rating';
import { useMyBooks } from '@/hooks/useMyBooks';

export default function MyBookPathPage() {
    const { user, uid } = useAuth();

    const router = useRouter();
    const { showAlert, alertValue, triggerAlert } = useAlert();
    const { myBooks, loading } = useMyBooks();

    useEffect(() => {
        const fetchMyBooks = async () => {
            if (uid === null) {
                triggerAlert('로그인 후 이용해주세요!');
                setTimeout(() => {
                    router.push('/');
                }, 2000);
            }

            if (!uid) return;
        };

        fetchMyBooks();
    }, [uid]);

    return (
        <div>
            <div className="text-2xl">{user?.displayName}님의 책갈피</div>

            {myBooks.length === 0 ? (
                <p className="text-gray-500 mt-10 text-center">등록된 책갈피가 없습니다.</p>
            ) : (
                <div className="flex flex-wrap items-center gap-2 w-full mt-4 space-y-2">
                    {myBooks.map((el) => (
                        <div className="flex flex-col items-center cursor-pointer" key={el.image} onClick={() => router.push(`/detail/${el.isbn}`)}>
                            <BookItem02 el={el} className="w-[150px] h-[213px]" />

                            <HeartRating heartValue={el.rating} readOnly />
                        </div>
                    ))}
                </div>
            )}
            {/* 알럿 */}
            {showAlert && <Alert alertValue={alertValue} />}
        </div>
    );
}
