'use client';
import { useState } from 'react';

import { BookItem } from '@/components/ui/bookItem';
import { Button } from '@/components/ui/button';
import { useBookData } from '@/hooks/useBookData';
import Modal from '@/components/ui/modal';
import { IBookItems } from '@/types/bookItems';

export default function Search() {
    const { bookData, loading, keyword, setKeyword, fetchBooks, page, setPage, totalData } = useBookData('');
    const [input, setInput] = useState('');
    const [selectedBook, setSelectedBook] = useState<IBookItems | null>(null);

    const handleSearch = () => {
        if (input === keyword) return;
        setKeyword(input);
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
            <div className="flex flex-wrap justify-start mt-10 mb-10 gap-2">
                {loading ? (
                    Array.from({ length: 10 }).map((_, idx) => (
                        <div key={idx} className="flex-shrink-0 flex flex-col items-center text-center w-[150px]">
                            <div className="w-full h-[213px] rounded-md bg-[#eee] animate-pulse"></div>
                            <div className="w-full h-5 mt-2 bg-[#ddd] rounded"></div>
                        </div>
                    ))
                ) : bookData.length > 0 ? (
                    bookData.map((el) => <BookItem onClick={() => setSelectedBook(el)} key={el.isbn} el={el} />)
                ) : keyword ? (
                    <p className="w-full text-center text-[#888] mt-4">검색 결과가 없습니다.</p>
                ) : null}
            </div>

            {/* 페이지네이션 */}
            {totalData > 0 && (
                <div className="text-center">
                    {Array.from({ length: Math.ceil(totalData / 10) }).map((_, idx) => (
                        <button key={idx} className={`m-2  ${page === idx + 1 ? 'text-[#5F9EA0] ' : 'text-[#888]'}`} onClick={() => setPage(idx + 1)}>
                            {idx + 1}
                        </button>
                    ))}
                </div>
            )}

            {/* 모달 */}
            <Modal selectedBook={selectedBook} setSelectedBook={setSelectedBook} />
        </div>
    );
}
