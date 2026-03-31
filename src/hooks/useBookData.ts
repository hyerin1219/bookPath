'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import { IBookItems } from '@/types';

export function useBookData(initialKeyword = '한국소설') {
    const [keyword, setKeyword] = useState(initialKeyword);
    const [bookData, setBookData] = useState<IBookItems[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalData, setTotalData] = useState(0);

    const cache = useRef<{ [key: string]: { [startIndex: number]: IBookItems[] } }>({});

    // useCallback을 사용하여 함수가 새로 생성되는 것을 방지
    const fetchBooks = useCallback(async (searchKeyword: string, pageNumber: number) => {
        if (!searchKeyword) return;

        const startIndex = (pageNumber - 1) * 10 + 1;

        // 캐시 확인
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
            setTotalData(Math.min(res.data.total, 1000)); // 네이버 API 1000개 제한
        } catch (err) {
            console.error('책 검색 실패', err);
            setBookData([]);
        } finally {
            setLoading(false);
        }
    }, []); // 의존성 배열을 비워 처음에 한 번만 생성되게 함

    //  검색어 변경 시 페이지 1로 초기화 및 디바운스 로직
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchBooks(keyword, page);
        }, 300); // 0.3초 동안 입력이 없으면 호출

        return () => clearTimeout(timer); // 연속 입력 시 이전 타이머 취소
    }, [keyword, page, fetchBooks]);

    return {
        bookData,
        loading,
        keyword,
        setKeyword,
        page,
        setPage,
        totalData,
        fetchBooks,
    };
}
