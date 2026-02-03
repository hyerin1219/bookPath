'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getFirestore, doc, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore';
import { IBookClub } from '@/types';
import { firebaseApp } from '@/components/commons/libraries/firebase';
import { Button } from '@/components/ui/button';
import JoinBookClubModal from '@/components/ui/joinBookClubModal';
import Alert from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/hooks/useAlert';

export default function AllBookClub() {
    const firestore = getFirestore(firebaseApp);
    const router = useRouter();
    const { uid, user } = useAuth();
    const { showAlert, alertValue, triggerAlert } = useAlert();
    const [isOpen, setIsOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [clubs, setClubs] = useState<IBookClub[]>([]);
    const [selectedClub, setSelectedClub] = useState<IBookClub | null>(null);

    // 등록 된 책갈피 모임
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
    }, [firestore]);

    // 책갈피 모임 가입
    const handleJoin = async (club: IBookClub, passwordInput: string) => {
        if (!uid) return triggerAlert('로그인이 필요합니다.');

        // 가입 여부 체크
        const isJoined = club.members.some((member) => member.user === uid);
        if (isJoined) return triggerAlert('이미 가입한 모임입니다.');

        // 비밀번호 체크
        if (passwordInput !== club.password) return triggerAlert('비밀번호가 일치하지 않습니다.');

        try {
            const docRef = doc(firestore, 'bookClub', club.id);
            const newMember = { user: uid, nickname: user?.displayName || '익명' };

            // Firestore 업데이트
            await updateDoc(docRef, {
                membersId: arrayUnion(uid),
                members: arrayUnion({ user: uid, role: 'member' }),
            });

            // 상태 업데이트
            setClubs(clubs.map((c) => (c.id === club.id ? { ...c, members: [...c.members, newMember] } : c)));

            triggerAlert('가입 완료!');
            setIsOpen(false);
        } catch (error) {
            if (error instanceof Error) console.log(error.message);
        }
    };

    if (clubs.length === 0) return <p>등록된 책갈피 모임이 없습니다.</p>;

    return (
        <div className="">
            <ul className="flex flex-col gap-2 mt-5">
                {clubs.map((club) => {
                    const isJoined = club.members.some((member) => member.user === uid);
                    return (
                        <li key={club.id} className="flex items-center justify-between w-full h-14 ">
                            <span>{club.clubName}</span>
                            {isJoined ? (
                                <Button onClick={() => router.push(`/bookClubDetail/${club.id}`)}>모임 가기</Button>
                            ) : (
                                <Button
                                    variant="submit"
                                    onClick={() => {
                                        setSelectedClub(club);
                                        setIsOpen(true);
                                    }}
                                >
                                    가입하기
                                </Button>
                            )}
                        </li>
                    );
                })}
            </ul>

            {showAlert && <Alert alertValue={alertValue} />}
            {isOpen && selectedClub && <JoinBookClubModal setIsOpen={setIsOpen} selectedClub={selectedClub} password={password} setPassword={setPassword} handleJoin={(pw) => handleJoin(selectedClub, pw)} />}
        </div>
    );
}
