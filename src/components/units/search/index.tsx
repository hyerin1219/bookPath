'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { IBookItems } from '@/types';
import { useBookData } from '@/hooks/useBookData';

import { BookItem } from '@/components/ui/bookItem';
import Modal from '@/components/ui/modal';
import SearchBox from '@/components/ui/searchBox';
import Pagination from '@/components/ui/pagination';

export default function Search() {
    const searchParams = useSearchParams();
    const [input, setInput] = useState('');
    const initialKeyword = searchParams.get('keyword') || '';

    const { bookData, loading, keyword, setKeyword, page, setPage, totalData } = useBookData(initialKeyword);
    const [selectedBook, setSelectedBook] = useState<IBookItems | null>(null);

    useEffect(() => {
        if (initialKeyword) {
            setInput(initialKeyword);
            setKeyword(initialKeyword);
        }
    }, [initialKeyword, setKeyword]);

    // 검색 로직
    const handleSearch = () => {
        const trimmed = input.trim();
        if (!trimmed || trimmed === keyword) return;

        setPage(1); // 새 검색어라면 페이지부터 1로 초기화
        setKeyword(trimmed); // keyword가 변하면 useBookData의 useEffect가 알아서 fetch
    };

    const totalPages = Math.ceil(totalData / 10);

    //  페이지네이션
    const handlePrev = () => {
        if (page > 1) setPage(page - 1); // page 상태만 바꾸면 훅이 알아서
    };

    const handleNext = () => {
        if (page < totalPages) setPage(page + 1);
    };

    return (
        <div className="w-full py-8">
            <SearchBox value={input} onChange={setInput} onClick={handleSearch} placeholder="검색어를 입력해보세요." />

            <div className="flex flex-wrap justify-center m-5 my-5 gap-8">
                {!keyword ? (
                    <div>검색어를 입력해보세요.</div>
                ) : loading ? (
                    Array.from({ length: 10 }).map((_, idx) => (
                        <div key={idx} className="flex-shrink-0 inline-flex flex-col items-center text-center w-[150px]">
                            <div className="w-full h-[213px] rounded-md bg-[#eee] animate-pulse"></div>
                            <div className="w-full h-5 mt-2 bg-[#ddd] rounded"></div>
                        </div>
                    ))
                ) : bookData.length > 0 ? (
                    bookData.map((el) => <BookItem key={`${el.title}-${el.isbn}`} el={el} onClick={() => setSelectedBook(el)} />)
                ) : (
                    <p className="w-full text-center text-[#888] mt-4">검색 결과가 없습니다.</p>
                )}
            </div>

            {totalPages > 1 && <Pagination onPrev={handlePrev} onNext={handleNext} totalPages={totalPages} page={page} />}

            <Modal selectedBook={selectedBook} setSelectedBook={setSelectedBook} />
        </div>
    );
}
