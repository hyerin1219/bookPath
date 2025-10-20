'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { firebaseApp } from '@/components/commons/libraries/firebase';

export default function AllBookClub() {
    const [clubs, setClubs] = useState<any[]>([]);

    const firestore = getFirestore(firebaseApp);

    useEffect(() => {
        const fetchClubs = async () => {
            const colRef = collection(firestore, 'bookClub');
            const snapshot = await getDocs(colRef);
            const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setClubs(data);
        };
        fetchClubs();
    }, []);

    if (clubs.length === 0) return <p>등록된 모임이 없습니다.</p>;

    return (
        <div>
            <ul className="flex flex-col gap-2 mt-5">
                {clubs.map((el) => (
                    <li key={el.id} className="w-full border-b pb-1">
                        <button>{el.clubName}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
