'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { collection, doc, getDoc, getDocs, getFirestore, updateDoc, query, where } from 'firebase/firestore'; // lite 제거하고 일반 firestore 사용 권장

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
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
    const firestore = getFirestore(firebaseApp);
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const { showAlert, alertValue, triggerAlert } = useAlert();

    const [selectedClubId, setSelectedClubId] = useState<string | null>(null);

    useEffect(() => {
        if (!uid) {
            setIsLoading(false);
            return;
        }

        const fetchClubs = async () => {
            setIsLoading(true);
            try {
                //memberIds 필드를 사용하여 내 모임만 쿼리
                const q = query(collection(firestore, 'bookClub'), where('membersId', 'array-contains', uid));

                const snapshot = await getDocs(q);
                const data: IBookClub[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...(doc.data() as Omit<IBookClub, 'id'>),
                }));

                setClubs(data);
                console.log('data', data);
            } catch (error) {
                console.error('데이터 로딩 오류:', error);
            } finally {
                setIsLoading(false); // 성공하든 실패하든 로딩 해제
            }
        };

        fetchClubs();
    }, [uid, firestore]);

    // 모임 탈퇴 함수
    const handleDeleteClub = async () => {
        if (!selectedClubId || !uid) return;

        try {
            const clubRef = doc(firestore, 'bookClub', selectedClubId);
            const clubSnap = await getDoc(clubRef);

            if (!clubSnap.exists()) {
                triggerAlert('모임이 존재하지 않습니다.');
                setIsOpen(false);
                return;
            }

            const clubData = clubSnap.data() as IBookClub & { memberIds: string[] };

            // 1. members 객체 배열 필터링
            const updatedMembers = clubData.members.filter((member) => member.user !== uid);
            // 2. 쿼리용 memberIds 문자열 배열 필터링
            const updatedMemberIds = clubData.memberIds?.filter((id) => id !== uid) || [];

            // Firestore 업데이트 (두 필드 모두 갱신)
            await updateDoc(clubRef, {
                members: updatedMembers,
                memberIds: updatedMemberIds,
            });

            // 클라이언트 상태 즉시 반영 (낙관적 업데이트)
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

    // 로딩 중일 때 보여줄 화면
    if (isLoading) {
        return (
            <div className="flex flex-col gap-2 mt-5 animate-pulse">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="w-full h-14 bg-gray-100 rounded-lg" />
                ))}
            </div>
        );
    }

    // 로딩이 끝났는데 데이터가 없을 때
    if (clubs.length === 0) {
        return <p className="text-center py-10 text-gray-500">참여 중인 모임이 없습니다.</p>;
    }

    return (
        <div>
            <ul className="flex flex-col gap-2 mt-5">
                {clubs.map((club) => (
                    <li key={club.id} className="flex items-center justify-between w-full h-14 border-b last:border-b-0">
                        <p>{club.clubName}</p>

                        <div className="flex gap-2">
                            <Button onClick={() => router.push(`/bookClubDetail/${club.id}`)}>모임 가기</Button>
                            <Button
                                onClick={() => {
                                    setSelectedClubId(club.id);
                                    setIsOpen(true);
                                }}
                                variant="close"
                            >
                                탈퇴 하기
                            </Button>
                        </div>
                    </li>
                ))}
            </ul>

            {showAlert && <Alert alertValue={alertValue} />}

            {/* 탈퇴 모달 */}
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-5 bg-white p-10 py-5 rounded-xl shadow-lg">
                        <p className="font-medium">정말 탈퇴하시겠습니까?</p>
                        <div className="flex gap-3">
                            <Button onClick={handleDeleteClub} variant="submit">
                                확인
                            </Button>
                            <Button variant="close" onClick={() => setIsOpen(false)}>
                                닫기
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
