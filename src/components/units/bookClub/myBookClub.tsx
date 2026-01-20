'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { collection, deleteDoc, doc, getDoc, getDocs, getFirestore, updateDoc } from 'firebase/firestore';

import { IBookClub } from '@/types';

import { firebaseApp } from '@/components/commons/libraries/firebase';
import { Button } from '@/components/ui/button';
import Alert from '@/components/ui/alert';

import { useAlert } from '@/hooks/useAlert';
import { useAuth } from '@/hooks/useAuth';

import { motion } from 'framer-motion';

export default function MyBookClub() {
    const { uid } = useAuth();
    const [clubs, setClubs] = useState<IBookClub[]>([]);
    const firestore = getFirestore(firebaseApp);
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const { showAlert, alertValue, triggerAlert } = useAlert();

    const [selectedClubId, setSelectedClubId] = useState<string | null>(null); // 어떤 모임 탈퇴할지 저장

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

    // 삭제 모달
    const handleOpenDeleteModal = () => {
        setIsOpen(true);
    };

    // 모임 탈퇴 함수
    const handleDeleteClub = async () => {
        if (!selectedClubId) return; // 선택된 모임이 없으면 종료

        try {
            const clubRef = doc(firestore, 'bookClub', selectedClubId);
            const clubSnap = await getDoc(clubRef);

            if (!clubSnap.exists()) {
                triggerAlert('모임이 존재하지 않습니다.');
                setIsOpen(false);
                return;
            }

            const clubData = clubSnap.data() as IBookClub;
            // members 배열에서 현재 사용자 제거
            const updatedMembers = clubData.members.filter((member) => member.user !== uid);

            // Firestore 업데이트
            await updateDoc(clubRef, { members: updatedMembers });

            // 상태에서도 제거
            setClubs((prev) => prev.filter((club) => club.id !== selectedClubId));

            triggerAlert('모임 탈퇴가 완료되었습니다.');
            setIsOpen(false);
            setSelectedClubId(null);
        } catch (error) {
            console.error(error);
            triggerAlert('모임 탈퇴 중 오류가 발생했습니다.');
            setIsOpen(false);
        }
    };

    if (clubs.length === 0) return <p>나의 모임이 없습니다.</p>;

    return (
        <div>
            <ul className="flex flex-col gap-2 mt-5">
                {clubs.map((club) => (
                    <li key={club.id} className="flex items-center justify-between w-full h-14 border-b last:border-b-0">
                        <p>{club.clubName}</p>

                        <div>
                            <Button onClick={() => router.push(`/bookClubDetail/${club.id}`)}>모임 가기</Button>
                            <Button
                                onClick={() => {
                                    setSelectedClubId(club.id);
                                    handleOpenDeleteModal();
                                }}
                                className="ml-2"
                                variant="close"
                            >
                                탈퇴 하기
                            </Button>
                        </div>
                    </li>
                ))}
            </ul>
            {/* 알럿 */}
            {showAlert && <Alert alertValue={alertValue} />}

            {/* 탈퇴 모달 */}
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="relative flex flex-col items-center gap-5 bg-white p-10 py-5 rounded-xl shadow-[2px_2px_6px_rgba(0,0,0,0.1)]">
                        <p>정말 탈퇴하시겠습니까?</p>
                        <div className="flex gap-5">
                            <Button onClick={handleDeleteClub} variant="submit" className="">
                                확인
                            </Button>
                            <Button variant="close" onClick={() => setIsOpen(false)} className="">
                                닫기
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
