'use client';

import { Button } from './button';

interface IPaginationProps {
    page: number; // 현재 페이지
    totalPages: number; // 전체 페이지 수
    totalData?: number; // 전체 데이터 개수 (선택)
    onPrev: () => void; // 이전 버튼 클릭 이벤트
    onNext: () => void; // 다음 버튼 클릭 이벤트
    className?: string; // 외부에서 스타일 추가
}

export default function Pagination({ page, totalPages, totalData, onPrev, onNext, className }: IPaginationProps) {
    return (
        <div className={`flex justify-center items-center gap-3 ${className}`}>
            <Button variant="search" onClick={onPrev} disabled={page === 1}>
                이전
            </Button>

            <p>
                <span>{page}</span>
                {totalData ? ` / ${totalData}` : ` / ${totalPages}`}
            </p>

            <Button variant="search" onClick={onNext} disabled={page === totalPages}>
                다음
            </Button>
        </div>
    );
}
