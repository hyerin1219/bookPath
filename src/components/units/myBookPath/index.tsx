'use client';
import Alert from '@/components/ui/alert';

import { useLoginCheck } from '@/hooks/useLoginCheck';
import { useUser } from '@/hooks/UserContext';

export default function MyBookPathPage() {
    const { showAlert } = useLoginCheck();
    const { userData } = useUser();

    return (
        <div>
            <div className="text-2xl">{userData?.properties?.nickname}님의 책갈피</div>

            {/* {showAlert && <Alert message="로그인 후 이용해주세요!" />} */}
        </div>
    );
}
