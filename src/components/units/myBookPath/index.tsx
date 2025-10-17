'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore/lite';

import { useAuth } from '@/hooks/useAuth';

import { IBookItems } from '@/types/bookItems';

import { firebaseApp } from '@/components/commons/libraries/firebase';
import Alert from '@/components/ui/alert';
import { BookItem02 } from '@/components/ui/bookItem02';

export default function MyBookPathPage() {
    const { user, uid } = useAuth();
    const [myBooks, setMyBooks] = useState<IBookItems[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchMyBooks = async () => {
            if (!uid) return;

            const firestore = getFirestore(firebaseApp);
            const q = query(collection(firestore, 'bookPath'), where('uid', '==', uid));
            const snapshot = await getDocs(q);

            const books = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as any;

            setMyBooks(books);
            console.log('books', books);
        };

        fetchMyBooks();
    }, [uid]);

    return (
        <div>
            <div className="text-2xl">{user?.displayName}님의 책갈피</div>

            {myBooks.length === 0 ? (
                <p className="text-gray-500 mt-10 text-center">등록된 책갈피가 없습니다.</p>
            ) : (
                <div className="flex flex-wrap items-center gap-5 mt-4 space-y-2">
                    {myBooks.map((el) => (
                        <div className="cursor-pointer" key={el.image} onClick={() => router.push(`/detail/${el.isbn}`)}>
                            <BookItem02 el={el} className="w-[150px] h-[213px]" />
                        </div>
                    ))}
                </div>
            )}

            {!uid && <Alert message="로그인 후 이용해주세요!" />}
        </div>
    );
}
