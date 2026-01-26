'use client';

import { useState } from 'react';
import { Button } from './button';

interface IRefineProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onApply?: (refinedText: string) => void;
}

export default function Refine({ value, onChange, onApply }: IRefineProps) {
    const [refined, setRefined] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const handleRefine = async () => {
        if (!value.trim()) return;

        setIsLoading(true);
        try {
            const res = await fetch('/api/refine', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: value }),
            });
            const data = await res.json();

            if (res.ok) {
                setRefined(data.refinedText);
                setIsActive(true);
            } else {
                alert(`에러: ${data.error}`);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // 클립보드 복사 함수
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(refined);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // 2초 뒤 상태 리셋
        } catch (err) {
            console.error('복사 실패:', err);
        }
    };

    return (
        <div className="w-full mt-10 mb-5 flex flex-col gap-2 ">
            <Button variant="search" onClick={handleRefine} disabled={isLoading} className={`text-sm self-end transition-all active:scale-95 ${isLoading ? 'pointer-events-none' : ''}`}>
                {isLoading ? '문장 교정 중..' : '문장 교정하기'}
            </Button>

            <div className="w-full h-130 bg-dot-grid rounded-lg overflow-hidden border border-gray-100 shadow-inner relative">
                <textarea className="size-full resize-none p-4 text-justify focus:outline-none bg-transparent leading-relaxed" value={value} onChange={onChange} placeholder="당신의 생각을 기록해보세요." />
            </div>

            {/* AI 결과창 */}
            {isActive && refined && (
                <div className="bg-white p-5 border-2 border-blue-50 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-blue-900 flex items-center gap-1">AI 교정 제안</h3>
                        <div className="flex gap-3">
                            <button onClick={handleCopy} className={`cursor-pointer text-xs transition-colors ${isCopied ? 'text-green-600 ' : 'text-blue-600 '}`}>
                                {isCopied ? '복사 완료' : '결과 복사하기'}
                            </button>
                            <button onClick={() => setIsActive(false)} className="cursor-pointer text-xs text-gray-400 hover:text-gray-600 ">
                                닫기
                            </button>
                        </div>
                    </div>
                    <p className="text-gray-700 text-sm leading-loose whitespace-pre-wrap  text-left">{refined}</p>
                </div>
            )}
        </div>
    );
}
