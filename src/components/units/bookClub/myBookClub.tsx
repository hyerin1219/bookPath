'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { firebaseApp } from '@/components/commons/libraries/firebase';
import { IBookClub } from '@/types/bookClub';
import { useAuth } from '@/hooks/useAuth';

export default function MyBookClub() {
    const { uid } = useAuth();
    const [clubs, setClubs] = useState<IBookClub[]>([]);
    const firestore = getFirestore(firebaseApp);

    useEffect(() => {
        const fetchClubs = async () => {
            const snapshot = await getDocs(collection(firestore, 'bookClub'));
            const data: IBookClub[] = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<IBookClub, 'id'>) })).filter((club) => club.members.includes(uid!));
            setClubs(data);
        };
        fetchClubs();
    }, [uid]);

    if (clubs.length === 0) return <p>나의 모임이 없습니다.</p>;

    return (
        <ul className="flex flex-col gap-2 mt-5">
            {clubs.map((club) => (
                <li key={club.id} className="w-full border-b pb-1 last:border-b-0">
                    {club.clubName}
                </li>
            ))}
        </ul>
    );
}
