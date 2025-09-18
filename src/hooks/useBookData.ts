import { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import { IBookItems } from '@/types/bookItems';

export function useBookData(initialKeyword = '도서') {
    const [keyword, setKeyword] = useState(initialKeyword);
    const [bookData, setBookData] = useState<IBookItems[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalData, setTotalData] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const fetchBooks = useCallback(
        async (searchKeyword?: string, pageNumber?: number) => {
            const query = searchKeyword ?? keyword;
            const currentPage = pageNumber ?? page;

            if (!query) {
                setBookData([]);
                setHasMore(false);
                return;
            }

            setLoading(true);
            try {
                const start = (currentPage - 1) * 10 + 1;
                const res = await axios.get('/api/books', {
                    params: { query, sort: 'date', start },
                });

                const filtered = res.data.items.filter((book: IBookItems) => /[가-힣]/.test(book.title)).slice(0, 10);

                // 기존 데이터에 이어 붙이기
                setBookData((prev) => (currentPage === 1 ? filtered : [...prev, ...filtered]));
                setTotalData(res.data.total);

                // 더 불러올 데이터 있는지
                setHasMore((currentPage - 1) * 10 + filtered.length < res.data.total);
            } catch (err) {
                console.error('책 검색 실패', err);
            } finally {
                setLoading(false);
            }
        },
        [keyword, page]
    );

    // 키워드 변경 시 초기화
    useEffect(() => {
        setBookData([]);
        setPage(1);
        setHasMore(true);
        fetchBooks(keyword, 1);
    }, [keyword, fetchBooks]);

    // 페이지 변경 시 fetch
    useEffect(() => {
        if (page === 1) return;
        fetchBooks(keyword, page);
    }, [page, keyword, fetchBooks]);

    return { bookData, loading, keyword, setKeyword, page, setPage, hasMore };
}
