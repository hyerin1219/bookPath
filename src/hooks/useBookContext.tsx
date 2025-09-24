'use client';

import { createContext, useState, useContext } from 'react';
import { IBookItems } from '@/types/bookItems';

interface BookContextType {
    selectedBook: IBookItems | null;
    setSelectedBook: (book: IBookItems | null) => void;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedBook, setSelectedBook] = useState<IBookItems | null>(null);

    return <BookContext.Provider value={{ selectedBook, setSelectedBook }}>{children}</BookContext.Provider>;
};

export const useBook = () => {
    const context = useContext(BookContext);
    if (!context) throw new Error('useBook must be used within BookProvider');
    return context;
};
