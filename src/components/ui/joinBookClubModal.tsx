'use client';

import { motion } from 'framer-motion';
import { Button } from './button';

import { IBookClub } from '@/types';

interface JoinBookClubModalProps {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    selectedClub: IBookClub | null;
    handleJoin: (password: string) => void;
    password: string;
}

export default function JoinBookClubModal({ setIsOpen, selectedClub, handleJoin, password, setPassword }: JoinBookClubModalProps) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="relative flex flex-col items-center gap-5 bg-white p-10 py-5 rounded-xl shadow-[2px_2px_6px_rgba(0,0,0,0.1)]">
                <div className="text-xl">{selectedClub?.clubName}모임 비밀번호를 입력하세요</div>

                <div className="flex items-center gap-2">
                    <p>비밀번호</p>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className=" bg-white shadow p-2 rounded-lg  border border-[#A8E6CF]  whitespace-pre-wrap break-all" />
                </div>
                {/* 버튼 */}
                <div className="flex items-center gap-5">
                    <Button variant="submit" onClick={() => handleJoin(password)} className="">
                        확인
                    </Button>
                    <Button
                        type="button"
                        variant="close"
                        onClick={() => {
                            setIsOpen(false);
                            setPassword('');
                        }}
                    >
                        닫기
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
