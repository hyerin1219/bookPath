'use client';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { IBookItems } from '@/types/bookItems';

export function useBookData(initialKeyword = '도서') {
    const [keyword, setKeyword] = useState(initialKeyword);
    const [bookData, setBookData] = useState<IBookItems[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalData, setTotalData] = useState(0);

    const cache = useRef<{ [key: string]: { [page: number]: IBookItems[] } }>({});

    const fetchBooks = async (searchKeyword: string, pageNumber: number) => {
        if (!searchKeyword) return;

        const startIndex = (pageNumber - 1) * 10 + 1;

        if (cache.current[searchKeyword]?.[startIndex]) {
            setBookData(cache.current[searchKeyword][startIndex]);
            return;
        }

        setLoading(true);
        try {
            const res = await axios.get('/api/books', {
                params: { query: searchKeyword, sort: 'date', start: startIndex },
            });

            const filtered = res.data.items.filter((book: IBookItems) => /[가-힣]/.test(book.title));

            if (!cache.current[searchKeyword]) cache.current[searchKeyword] = {};
            cache.current[searchKeyword][startIndex] = filtered;

            setBookData(filtered);
            setTotalData(res.data.total);
        } catch (err) {
            console.error('책 검색 실패', err);
            setBookData([]);
        } finally {
            setLoading(false);
        }
    };

    // 키워드 변경 시 page 초기화 및 fetch
    useEffect(() => {
        setPage(1);
        fetchBooks(keyword, 1);
    }, [keyword]);

    // page 변경 시 fetch
    useEffect(() => {
        fetchBooks(keyword, page);
    }, [page, keyword]);

    return { bookData, loading, keyword, setKeyword, page, setPage, totalData, fetchBooks };
}
