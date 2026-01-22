import { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore/lite';
import { firebaseApp } from '@/components/commons/libraries/firebase';
import { IBookItems } from '@/types';
import { useAuth } from '@/hooks/useAuth';

export function useMyBooks() {
    const { uid } = useAuth();
    const [myBooks, setMyBooks] = useState<IBookItems[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            if (!uid) {
                setMyBooks([]);
                setLoading(false);
                return;
            }

            const firestore = getFirestore(firebaseApp);
            // const q = query(collection(firestore, 'bookPath'), where('uid', '==', uid));
            const ref = collection(firestore, 'users', uid, 'books');
            const snapshot = await getDocs(ref);

            // const books = snapshot.docs.map((doc) => ({
            //     id: doc.id,
            //     ...doc.data(),
            // })) as any;

            const books = snapshot.docs.map((doc) => ({
                ...doc.data(),
            })) as IBookItems[];

            setMyBooks(books);
            setLoading(false);
        };

        fetchBooks();
    }, [uid]);

    return { myBooks, loading };
}
