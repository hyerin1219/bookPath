'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { firebaseApp } from '@/components/commons/libraries/firebase';
import { IBookClub } from '@/types/bookClub';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function MyBookClub() {
    const { uid } = useAuth();
    const [clubs, setClubs] = useState<IBookClub[]>([]);
    const firestore = getFirestore(firebaseApp);
    const router = useRouter();

    useEffect(() => {
        const fetchClubs = async () => {
            const snapshot = await getDocs(collection(firestore, 'bookClub'));
            const data: IBookClub[] = snapshot.docs
                .map((doc) => ({
                    id: doc.id,
                    ...(doc.data() as Omit<IBookClub, 'id'>),
                }))
                .filter((club) => club.members.some((member) => member.user === uid));

            setClubs(data);
        };
        fetchClubs();
    }, [uid, firestore]);

    if (clubs.length === 0) return <p>나의 모임이 없습니다.</p>;

    return (
        <ul className="flex flex-col gap-2 mt-5">
            {clubs.map((club) => (
                <li key={club.id} className="flex items-center justify-between w-full h-14 border-b last:border-b-0">
                    {club.clubName}

                    <Button onClick={() => router.push(`/bookClubDetail/${club.id}`)}>모임 가기</Button>
                </li>
            ))}
        </ul>
    );
}
