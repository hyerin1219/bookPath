'use client';
import { useState } from 'react';
import { BookItem } from '@/components/ui/bookItem';
import { Button } from '@/components/ui/button';
import { useBookData } from '@/hooks/useBookData';
import Modal from '@/components/ui/modal';
import { IBookItems } from '@/types/bookItems';

export default function Search() {
    const { bookData, loading, keyword, setKeyword, page, setPage, totalData, fetchBooks } = useBookData('');
    const [input, setInput] = useState('');
    const [selectedBook, setSelectedBook] = useState<IBookItems | null>(null);

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

    const handlePageClick = (pageNumber: number) => {
        if (pageNumber === page) return;
        setPage(pageNumber);
        fetchBooks(keyword, pageNumber);
    };

    return (
        <div>
            {/* 검색 입력창 */}
            <div className="flex items-center justify-between mb-4">
                <input value={input} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} onChange={(e) => setInput(e.target.value)} type="text" className="w-[85%] p-2 bg-[#eee] rounded-xl shadow-[inset_2px_2px_0px_rgba(0,0,0,0.3)]" placeholder="검색어를 입력해보세요." />
                <Button variant="search" onClick={handleSearch}>
                    검색
                </Button>
            </div>

            {/* 검색 결과 */}
            <div className="flex flex-wrap justify-center m-5 my-10 gap-8">
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
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mb-10">
                    <Button variant="search" onClick={handlePrev} disabled={page === 1}>
                        이전
                    </Button>

                    <p>
                        <span>{page}</span>/ <span>{totalData}</span>
                    </p>

                    <Button variant="search" onClick={handleNext} disabled={page === totalPages}>
                        다음
                    </Button>
                </div>
            )}

            {/* 모달 */}
            <Modal selectedBook={selectedBook} setSelectedBook={setSelectedBook} />
        </div>
    );
}
