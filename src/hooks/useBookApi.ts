import { useEffect, useState } from "react";
import axios from "axios";
import { IBookItems } from '@/types/bookItems';

export function useBookApi() {
    const [bookData, setBookData] = useState<IBookItems[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        async function fetchBooks() {
            try {
                const response = await axios.get("/api/books", {
                    params: { query: "도서", sort: "date" }, // 최신 출간된 도서 가져오기
                });
                setBookData(response.data.items);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
                console.log("로딩에 실패했습니다.")
            }
        }

        fetchBooks();
    }, []);
    return { bookData, loading };
}