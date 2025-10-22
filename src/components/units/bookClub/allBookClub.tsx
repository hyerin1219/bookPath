'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore, doc, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore';

import { IBookClub } from '@/types/bookClub';

import { firebaseApp } from '@/components/commons/libraries/firebase';
import { Button } from '@/components/ui/button';
import JoinBookClubModal from '@/components/ui/joinBookClubModal';
import Alert from '@/components/ui/alert';

import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/hooks/useAlert';

export default function AllBookClub() {
    const { uid } = useAuth();
    const [clubs, setClubs] = useState<IBookClub[]>([]);
    const [password, setPassword] = useState('');
    const firestore = getFirestore(firebaseApp);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedClub, setSelectedClub] = useState<IBookClub | null>(null);
    const { showAlert, alertValue, triggerAlert } = useAlert();

    useEffect(() => {
        const colRef = collection(firestore, 'bookClub');
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const data: IBookClub[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<IBookClub, 'id'>),
            }));
            setClubs(data);
        });

        return () => unsubscribe();
    }, []);

    const handleJoin = async (club: IBookClub, password: string) => {
        // if (club.members.includes(uid!)) {
        //     return triggerAlert('이미 가입한 모임입니다!');
        // }

        if (password !== club.password) {
            triggerAlert('비밀번호가 일치하지 않습니다!');
        }

        try {
            const docRef = doc(firestore, 'bookClub', club.id);
            await updateDoc(docRef, { members: arrayUnion(uid) });
            triggerAlert('가입 완료!');
            setClubs(clubs.map((c) => (c.id === club.id ? { ...c, members: [...c.members, uid!] } : c)));
            setIsOpen(false);
        } catch (error) {
            if (error instanceof Error) alert(error.message);
        }
    };

    if (clubs.length === 0) return <p>등록된 모임이 없습니다.</p>;

    return (
        <div className="">
            <ul className="flex flex-col gap-2 mt-5">
                {clubs.map((el) => (
                    <li key={el.id} className="w-full border-b pb-1 last:border-b-0 flex justify-between">
                        <span>{el.clubName}</span>
                        {(el.members || []).includes(uid!) ? (
                            <Button variant="close" disabled>
                                가입 완료
                            </Button>
                        ) : (
                            <Button
                                variant="submit"
                                onClick={() => {
                                    setSelectedClub(el);
                                    setIsOpen(true);
                                }}
                            >
                                가입하기
                            </Button>
                        )}
                    </li>
                ))}
            </ul>
            {showAlert && <Alert alertValue={alertValue} />}
            {isOpen && selectedClub && (
                <JoinBookClubModal
                    setIsOpen={setIsOpen}
                    selectedClub={selectedClub}
                    password={password}
                    setPassword={setPassword}
                    handleJoin={(password) => handleJoin(selectedClub, password)} //
                />
            )}
        </div>
    );
}
