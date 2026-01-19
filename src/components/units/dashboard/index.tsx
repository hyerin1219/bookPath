import { useRouter } from 'next/navigation';
import { useState } from 'react';

import SearchBox from '@/components/ui/searchBox';
import { Slide } from '@/components/ui/slide';
import { BookChart } from '@/components/ui/bookChart';
import { useBookData } from '@/hooks/useBookData';
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const { keyword, setKeyword } = useBookData('');
    const [input, setInput] = useState('');

    const handleSearch = () => {
        const trimmed = input.trim();
        if (!trimmed || trimmed === keyword) return;

        router.push(`/search?keyword=${encodeURIComponent(trimmed)}`);
        setKeyword(trimmed);
    };

    return (
        <div className="w-full h-full  py-8 px-2">
            {/* 검색 */}
            <section className="flex items-start justify-center gap-5 flex-col md:flex-row mb-8">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight">어떤 책을 찾고 계세요?</h2>
                    <p className="text-gray-500 text-sm">제목, 저자, 키워드로 원하는 책을 빠르게 찾아보세요.</p>
                </div>

                <SearchBox className="w-full" value={input} onChange={setInput} onClick={handleSearch} placeholder="검색어를 입력해 보세요" />
            </section>

            {/* 추천 도서 */}
            <section className="mb-8">
                <div className="mb-3">
                    <h3 className="text-xl font-semibold">오늘의 추천 도서</h3>
                    <p className="text-gray-500 text-sm">오늘의 추천 도서를 확인해보세요.</p>
                </div>

                <Slide />
            </section>

            {/* 월별 독서량 */}
            {user && (
                <section>
                    <h3 className="text-xl mb-3">
                        <span className="font-semibold">{user?.displayName}</span>님의 독서 데이터
                    </h3>

                    <div className="p-4 bg-white border border-gray-300 rounded-xl shadow-md">
                        <BookChart />
                    </div>
                </section>
            )}
        </div>
    );
}
