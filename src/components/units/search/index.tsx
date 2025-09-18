'use client';
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { BookItem } from '@/components/ui/bookItem';
import { Button } from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import { useBookData } from '@/hooks/useBookData';
import { IBookItems } from '@/types/bookItems';

export default function Search() {
    const { bookData, loading, keyword, setKeyword, page, setPage, hasMore } = useBookData('');
    const [input, setInput] = useState('');
    const [selectedBook, setSelectedBook] = useState<IBookItems | null>(null);

    const handleSearch = () => {
        if (input === keyword) return;
        setKeyword(input);
    };

    return (
        <div>
            {/* 검색창 */}
            <div className="flex items-center justify-between mb-4">
                <input value={input} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} onChange={(e) => setInput(e.target.value)} type="text" className="w-[85%] p-2 bg-[#eee] rounded-xl shadow-[inset_2px_2px_0px_rgba(0,0,0,0.3)]" placeholder="검색어를 입력해보세요." />
                <Button variant="search" onClick={handleSearch}>
                    검색
                </Button>
            </div>

            {/* Infinite Scroll */}
            <InfiniteScroll
                dataLength={bookData.length}
                next={() => setPage((prev) => prev + 1)}
                hasMore={hasMore}
                loader={
                    <div className="mt-4">
                        {Array.from({ length: 10 }).map((_, idx) => (
                            <div key={idx} className="flex-shrink-0 inline-flex flex-col items-center text-center w-[150px] m-2">
                                <div className="w-full h-[213px] rounded-md bg-[#eee] animate-pulse"></div>
                                <div className="w-full h-5 mt-2 bg-[#ddd] rounded"></div>
                            </div>
                        ))}
                    </div>
                }
            >
                <div className="inline-flex mt-10 mb-10">
                    {bookData.map((book) => (
                        <BookItem key={book.isbn} el={book} onClick={() => setSelectedBook(book)} />
                    ))}
                </div>
            </InfiniteScroll>

            {/* 모달 */}
            <Modal selectedBook={selectedBook} setSelectedBook={setSelectedBook} />
        </div>
    );
}
