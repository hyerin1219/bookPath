'use client';

import { motion } from 'framer-motion';
import { Button } from './button';
import { useAlert } from '@/hooks/useAlert';
import { useState } from 'react';
import Alert from './alert';
import { collection, addDoc, getFirestore, query, getDocs, where } from 'firebase/firestore';
import { firebaseApp } from '../commons/libraries/firebase';

interface BookClubProps {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateBookClubModal({ setIsOpen }: BookClubProps) {
    const { showAlert, alertValue, triggerAlert } = useAlert();
    const [clubName, setClubName] = useState('');
    const [password, setPassword] = useState('');

    const firestore = getFirestore(firebaseApp);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); //기본 새로고침 방지

        if (!clubName.trim()) {
            triggerAlert('모임 이름을 입력해주세요!');
            return;
        }

        const q = query(collection(firestore, 'bookClub'), where('clubName', '==', clubName));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            triggerAlert('이미 존재하는 모임 이름입니다!');
            return;
        }

        if (!password.trim()) {
            triggerAlert('비밀번호를 입력해주세요!');
            return;
        }

        if (password.length <= 4) {
            triggerAlert('비밀번호가 너무 짧습니다!');
            return;
        }

        try {
            await addDoc(collection(firestore, 'bookClub'), {
                clubName,
                password,
                createdAt: new Date().toISOString(),
            });

            triggerAlert('모임이 등록되었습니다!');
            setClubName('');
            setPassword('');
            setTimeout(() => setIsOpen(false), 2000);
        } catch (error) {
            if (error instanceof Error) alert(error.message);
        }
    };
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="relative flex flex-col items-center gap-5 bg-white p-10 py-5 rounded-xl shadow-[2px_2px_6px_rgba(0,0,0,0.1)]">
                <div className="text-xl">책갈피 모임 만들기</div>

                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <p>모임이름</p>
                        <input value={clubName} onChange={(e) => setClubName(e.target.value)} type="text" className="bg-[#eee] p-1 rounded" />
                    </div>

                    <div className="flex items-center gap-2">
                        <p>비밀번호</p>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} type="text" className="bg-[#eee] p-1 rounded" />
                    </div>
                </div>
                {/* 버튼 */}
                <div className="flex items-center gap-5">
                    <Button variant="submit" className="">
                        등록
                    </Button>
                    <Button type="button" variant="close" onClick={() => setIsOpen(false)} className="">
                        닫기
                    </Button>
                </div>
            </motion.form>

            {showAlert && <Alert alertValue={alertValue} />}
        </div>
    );
}
