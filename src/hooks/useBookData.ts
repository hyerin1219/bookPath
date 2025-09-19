import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { IBookItems } from '@/types/bookItems';

export function useBookData(initialKeyword = '도서') {
    const [keyword, setKeyword] = useState(initialKeyword);
    const [bookData, setBookData] = useState<IBookItems[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalData, setTotalData] = useState(0);

    // 검색어, 페이지 캐시
    const cache = useRef<{ [key: string]: { [page: number]: IBookItems[] } }>({});

    const fetchBooks = async (searchKeyword?: string, pageNumber?: number) => {
        const query = searchKeyword || keyword;
        const currentPage = pageNumber || page;

        // 검색어 없으면 리턴
        if (!query) {
            setBookData([]);
            setLoading(false);
            return;
        }

        // 캐시 확인
        if (cache.current[query]?.[currentPage]) {
            setBookData(cache.current[query][currentPage]);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const res = await axios.get('/api/books', {
                params: { query, sort: 'date', page: currentPage },
            });

            // 한글 제목만
            const filtered = res.data.items.filter((book: IBookItems) => /[가-힣]/.test(book.title)).slice(0, 10);

            // 캐시에 저장
            if (!cache.current[query]) cache.current[query] = {};
            cache.current[query][currentPage] = filtered;

            setBookData(filtered);
            setTotalData(res.data.total);
        } catch (err) {
            console.error('책 검색 실패', err);
            setBookData([]);
        } finally {
            setLoading(false);
        }
    };

    // 키워드 변경 시 자동 fetch
    useEffect(() => {
        setPage(1);
        fetchBooks();
    }, [keyword]);

    // 페이지 변경 시 fetch
    useEffect(() => {
        fetchBooks(keyword, page);
    }, [page]);

    return { bookData, loading, keyword, setKeyword, page, setPage, fetchBooks, totalData };
}
