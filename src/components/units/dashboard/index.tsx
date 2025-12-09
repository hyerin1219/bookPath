import { useRouter } from 'next/navigation';
import { useState } from 'react';

import SearchBox from '@/components/ui/searchBox';
import { Slide } from '@/components/ui/slide';
import { useBookData } from '@/hooks/useBookData';

import { useAuth } from '@/hooks/useAuth';
import { BookChart } from '@/components/ui/bookChart';

export default function Dashboard() {
    const { keyword, setKeyword } = useBookData('');
    const [input, setInput] = useState('');
    const router = useRouter();

    const handleSearch = () => {
        const trimmed = input.trim();
        if (!trimmed || trimmed === keyword) return;

        router.push(`/search?keyword=${encodeURIComponent(trimmed)}`);
        setKeyword(trimmed);
    };

    const { user } = useAuth();

    return (
        <div className="w-full h-full space-y-14 py-10 px-2">
            {/* 검색 */}
            <section className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight">어떤 책을 찾고 계세요?</h2>
                <p className="text-gray-500 text-sm">제목, 저자, 키워드로 원하는 책을 빠르게 찾아보세요.</p>

                <div className="mt-4">
                    <SearchBox value={input} onChange={setInput} onClick={handleSearch} placeholder="검색어를 입력해 보세요" />
                </div>
            </section>

            {/* 추천 도서 */}
            <section className="flex items-start justify-between gap-10">
                {/* 왼쪽 소개 영역 */}
                <div className="w-[28%] pt-3 ">
                    <h3 className="text-2xl leading-snug font-semibold ">당책 속에서 발견한 생각들이, 나만의 길을 이어줍니다.</h3>

                    <p className="text-gray-500 text-sm mt-4 leading-relaxed">책 속에서 발견한 문장과 생각을 기록해보세요.</p>
                </div>

                {/* 오른쪽 슬라이드 */}
                <div className="w-[72%]">
                    <h3 className="text-xl font-semibold mb-4">오늘의 추천 도서</h3>

                    <Slide />
                </div>
            </section>

            {/* 월별 독서량 */}
            {user && (
                <section>
                    <h3 className="text-xl mb-4">
                        <span className="font-semibold">{user?.displayName}</span>님의 독서 데이터
                    </h3>
                    <BookChart />
                </section>
            )}
        </div>
    );
}
