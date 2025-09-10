import axios from "axios";
import { useEffect, useState } from "react";

export function useBookApi() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBooks() {
            try {
                const response = await axios.get("/api/books", {
                    params: { query: "주식" },
                });
                setBooks(response.data.items);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchBooks();
    }, []);
    return { books };
}