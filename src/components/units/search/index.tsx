'use client';
import { useEffect, useState } from 'react';

import { IBookItems } from '@/types/bookItems';

import { useBookData } from '@/hooks/useBookData';

import { BookItem } from '@/components/ui/bookItem';
import { Button } from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import SearchBox from '@/components/ui/searchBox';
import { useSearchParams } from 'next/navigation';
import Pagination from '@/components/ui/pagination';

export default function Search() {
    const searchParams = useSearchParams();
    const initialKeyword = searchParams.get('keyword') || '';

    const { bookData, loading, keyword, setKeyword, page, setPage, totalData, fetchBooks } = useBookData('');
    const [input, setInput] = useState('');
    const [selectedBook, setSelectedBook] = useState<IBookItems | null>(null);

    useEffect(() => {
        if (initialKeyword) {
            setKeyword(initialKeyword);
            setInput(initialKeyword);
            fetchBooks(initialKeyword, 1);
        }
    }, [initialKeyword]);

    const handleSearch = () => {
        const trimmed = input.trim();
        if (!trimmed || trimmed === keyword) return;
        setKeyword(trimmed);
    };

    const totalPages = Math.ceil(totalData / 10);

    const handlePrev = () => {
        if (page > 1) {
            const newPage = page - 1;
            setPage(newPage);
            fetchBooks(keyword, newPage);
        }
    };

    const handleNext = () => {
        if (page < totalPages) {
            const newPage = page + 1;
            setPage(newPage);
            fetchBooks(keyword, newPage);
        }
    };

    return (
        <div className="w-full py-8">
            {/* 검색 입력창 */}
            <SearchBox value={input} onChange={setInput} onClick={handleSearch} placeholder="검색어를 입력해보세요." />

            {/* 검색 결과 */}
            <div className="flex flex-wrap justify-center m-5 my-5 gap-8">
                {loading
                    ? Array.from({ length: 10 }).map((_, idx) => (
                          <div key={idx} className="flex-shrink-0 inline-flex flex-col items-center text-center w-[150px]">
                              <div className="w-full h-[213px] rounded-md bg-[#eee] animate-pulse"></div>
                              <div className="w-full h-5 mt-2 bg-[#ddd] rounded"></div>
                          </div>
                      ))
                    : bookData.length > 0
                    ? bookData.map((el) => <BookItem key={`${el.title}-${el.isbn}`} el={el} onClick={() => setSelectedBook(el)} />)
                    : keyword && <p className="w-full text-center text-[#888] mt-4">검색 결과가 없습니다.</p>}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && <Pagination onPrev={handlePrev} onNext={handleNext} totalPages={totalPages} page={page} />}

            {/* 모달 */}
            <Modal selectedBook={selectedBook} setSelectedBook={setSelectedBook} />
        </div>
    );
}
