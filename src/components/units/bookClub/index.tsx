'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Alert from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import CreateBookClubModal from '@/components/ui/createBookClubModal';
import AllBookClub from './allBookClub';
import MyBookClub from './myBookClub';

import { useAlert } from '@/hooks/useAlert';
import { useAuth } from '@/hooks/useAuth';

export default function BookClub() {
    const { showAlert, alertValue, triggerAlert } = useAlert();
    const { uid } = useAuth();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');

    useEffect(() => {
        if (uid === null) {
            triggerAlert('로그인 후 이용해주세요!');
            setTimeout(() => router.push('/'), 2000);
        }
    }, [uid, router, triggerAlert]);

    return (
        <div>
            <div className="text-2xl font-bold">책갈피 모임</div>

            <div className="mt-5">
                <div className="flex justify-between items-center">
                    {/* Tab Menu */}
                    <div className="flex items-center gap-5">
                        <Button onClick={() => setActiveTab('all')}>전체 책갈피 모임 보기</Button>
                        <Button onClick={() => setActiveTab('my')}>나의 책갈피 모임 가기</Button>
                    </div>

                    <Button onClick={() => setIsOpen(true)} variant="search">
                        책갈피 모임 만들기
                    </Button>
                </div>

                {/* Tab Content: CSS의 hidden 속성을 사용하여 데이터 유지 */}
                <div className="mt-8">
                    {/* AllBookClub 탭 */}
                    <div className={activeTab === 'all' ? 'block' : 'hidden'}>
                        <AllBookClub />
                    </div>

                    {/* MyBookClub 탭 */}
                    <div className={activeTab === 'my' ? 'block' : 'hidden'}>
                        <MyBookClub />
                    </div>
                </div>
            </div>

            {showAlert && <Alert alertValue={alertValue} />}
            {isOpen && <CreateBookClubModal setIsOpen={setIsOpen} />}
        </div>
    );
}
