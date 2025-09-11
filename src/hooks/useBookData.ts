import { useEffect, useState } from "react";
import axios from "axios";
import { IBookItems } from '@/types/bookItems';

export function useBookData(initialKeyword = "도서") {
    const [keyword, setKeyword] = useState(initialKeyword);
    const [bookData, setBookData] = useState<IBookItems[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBooks = async (searchKeyword?: string) => {
        setLoading(true);
        try {
            const query = searchKeyword || keyword;
            if (!query) { // 검색어 없으면 fetch 안 함
                setBookData([]);
                setLoading(false);
                return;
            }

            const res = await axios.get("/api/books", {
                params: { query, sort: "date" }, // 최신 기준
            });
            const filtered = res.data.items
                .filter((book: IBookItems) => /[가-힣]/.test(book.title)) // 한글 포함 여부 체크
                .slice(0, 10); // 최신 10개만
            setBookData(filtered);
        } catch (err) {
            console.error("책 검색 실패", err);
            setBookData([]);
        } finally {
            setLoading(false);
        }
    };


    // 키워드 변경 시 자동 fetch
    useEffect(() => {
        fetchBooks();
    }, [keyword]);


    return { bookData, loading, keyword, setKeyword, fetchBooks };
}