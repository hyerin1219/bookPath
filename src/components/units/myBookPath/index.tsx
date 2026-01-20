'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/hooks/useAlert';
import { useMyBooks } from '@/hooks/useMyBooks';

import HeartRating from '@/components/ui/rating';
import { BookItem02 } from '@/components/ui/bookItem02';
import Alert from '@/components/ui/alert';
import { BookChart } from '@/components/ui/bookChart';
import Pagination from '@/components/ui/pagination';

export default function MyBookPathPage() {
    const { user, uid } = useAuth();
    const router = useRouter();
    const { showAlert, alertValue, triggerAlert } = useAlert();
    const { myBooks } = useMyBooks();

    // 페이지네이션 state
    const [page, setPage] = useState(1);
    const perPage = 10;

    const totalData = myBooks.length;
    const totalPages = Math.ceil(totalData / perPage);

    const startIdx = (page - 1) * perPage;
    const endIdx = startIdx + perPage;
    const currentBooks = myBooks.slice(startIdx, endIdx);

    const handlePrev = () => {
        if (page > 1) setPage((prev) => prev - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage((prev) => prev + 1);
    };

    useEffect(() => {
        if (uid === null) {
            triggerAlert('로그인 후 이용해주세요!');
            setTimeout(() => router.push('/'), 2000);
        }
    }, [uid]);

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
            <h2 className="text-2xl font-semibold">{user?.displayName}님의 책갈피</h2>
            <h3 className="text-xl mb-3">{user?.displayName}님의 독후감</h3>

            {/* 책 리스트 */}
            {myBooks.length === 0 ? (
                <p className="text-gray-500 mt-10 text-center">등록된 책갈피가 없습니다.</p>
            ) : (
                <div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 ">
                        {currentBooks.map((el) => (
                            <div key={el.isbn} className="flex flex-col items-center cursor-pointer" onClick={() => router.push(`/detail/${el.isbn}`)}>
                                <BookItem02 scale={true} className="w-[150px] h-[213px]" el={el} />
                                <HeartRating heartValue={el.rating} readOnly />
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPrev={handlePrev} onNext={handleNext} className="mt-6" />}
                </div>
            )}

            {/* 독서량 */}
            <div>
                <h3 className="text-xl mb-3">{user?.displayName}님의 월별 독서량</h3>

                <div className="p-4 bg-white border border-gray-300 rounded-xl shadow-md">
                    <BookChart />
                </div>
            </div>

            {showAlert && <Alert alertValue={alertValue} />}
        </div>
    );
}
