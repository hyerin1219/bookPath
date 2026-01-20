'use client';

import { createContext, useState, useContext, useMemo } from 'react';
import { IBookItems } from '@/types';

interface BookContextType {
    selectedBook: IBookItems | null;
    setSelectedBook: (book: IBookItems | null) => void;
    recentSearches: string[]; // 최근 검색어 저장
    addRecentSearch: (query: string) => void;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedBook, setSelectedBook] = useState<IBookItems | null>(null);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    const addRecentSearch = (query: string) => {
        setRecentSearches((prev) => [query, ...prev.filter((q) => q !== query)].slice(0, 5));
    };

    // context value를 메모제이션하여 불필요한 리렌더링 방지
    const value = useMemo(
        () => ({
            selectedBook,
            setSelectedBook,
            recentSearches,
            addRecentSearch,
        }),
        [selectedBook, recentSearches]
    );
    return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};

export const useBook = () => {
    const context = useContext(BookContext);
    if (!context) throw new Error('useBook must be used within BookProvider');
    return context;
};
