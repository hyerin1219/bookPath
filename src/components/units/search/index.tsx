'use client'

import { BookItem } from "@/components/ui/bookItem";
import { useBookData } from "@/hooks/useBookData";
import { useState } from "react";

export default function Search() {
    const { bookData, loading, keyword, setKeyword, fetchBooks } = useBookData("");
    const [input, setInput] = useState("");

    const handleSearch = () => {
        setKeyword(input);
    };

    return (
        <div>
            {/* 검색 입력창 */}
            <div className="flex items-center justify-between mb-4">
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    type="text"
                    className="w-[85%] p-2 bg-[#eee] rounded-xl shadow-[inset_2px_2px_0px_rgba(0,0,0,0.3)]"
                    placeholder="도서를 검색해보세요."
                />
                <button onClick={handleSearch} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                    검색
                </button>
            </div>

            {/* 검색 결과 */}
            <div className="flex flex-wrap justify-start mt-10 gap-2">
                {loading
                    ? Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="flex-shrink-0 flex flex-col items-center text-center w-[150px]">
                            <div className="w-full h-[213px] rounded-md bg-[#eee] animate-pulse"></div>
                            <div className="w-full h-5 mt-2 bg-[#ddd] rounded"></div>
                        </div>
                    ))
                    : bookData.length > 0 ? (
                        bookData.map(el => <BookItem key={el.isbn} el={el} />)
                    ) : keyword ? (
                        <p className="w-full text-center text-[#888] mt-4">검색 결과가 없습니다.</p>
                    ) : null}
            </div>
        </div>
    );
}