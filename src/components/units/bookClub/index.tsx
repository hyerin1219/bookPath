'use client';

import { useEffect, useState } from 'react';

import Alert from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

import { useAlert } from '@/hooks/useAlert';
import { useAuth } from '@/hooks/useAuth';
import CreateBookClubModal from '@/components/ui/createBookClubModal';
import { useRouter } from 'next/navigation';
import AllBookClub from './allBookClub';
import MyBookClub from './myBookClub';

export default function BookClub() {
    const { showAlert, alertValue, triggerAlert } = useAlert();
    const { uid } = useAuth();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'my'>('all'); // 탭 상태

    useEffect(() => {
        if (uid === null) {
            triggerAlert('로그인 후 이용해주세요!');
            setTimeout(() => {
                router.push('/');
            }, 2000);
        }
    }, [uid]);

    return (
        <div>
            <div className="text-2xl">책갈피 모임</div>

            <div className="mt-5">
                <div className="flex justify-between">
                    {/* tabMenu */}
                    <div className="flex items-center gap-5">
                        <Button onClick={() => setActiveTab('all')}>전체 책갈피 모임 보기</Button>
                        <Button onClick={() => setActiveTab('my')}>나의 책갈피 모임 가기</Button>
                    </div>

                    {/* 모달로 작동 */}
                    <Button onClick={() => setIsOpen(true)} variant="search">
                        책갈피 모임 만들기
                    </Button>
                </div>

                {/* tabContent */}
                <div className="mt-5">
                    {activeTab === 'all' && <AllBookClub />}
                    {activeTab === 'my' && <MyBookClub />}
                </div>
            </div>

            {/* 알럿 */}
            {showAlert && <Alert alertValue={alertValue} />}
            {/* 책갈피 모임 만들기 모달 */}
            {isOpen && <CreateBookClubModal setIsOpen={setIsOpen} />}
        </div>
    );
}
