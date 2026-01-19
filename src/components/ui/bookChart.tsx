import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { useMyBooks } from '@/hooks/useMyBooks';

import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, LabelList, ResponsiveContainer, Cell } from 'recharts';

interface IChartData {
    month: string;
    count: number;
    year: string;
}

export function BookChart() {
    const [chartData, setChartData] = useState<IChartData[]>([]);
    const [allData, setAllData] = useState<IChartData[]>([]);
    const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
    const { uid } = useAuth();
    const { myBooks, loading } = useMyBooks();

    function toDate(date: unknown): Date {
        if (!date) return new Date();
        if (date instanceof Date) return date;
        if (typeof date === 'string') return new Date(date);
        if (typeof date === 'object' && 'toDate' in date && typeof date.toDate === 'function') {
            return date.toDate();
        }
        return new Date();
    }

    useEffect(() => {
        if (!uid || loading) return;

        const monthlyData = myBooks.reduce<Record<string, number>>((acc, book) => {
            const dateObj = toDate(book.date);
            const monthKey = format(dateObj, 'yyyy-MM'); // "2024-05" 형태
            acc[monthKey] = (acc[monthKey] || 0) + 1;
            return acc;
        }, {});

        const result = Object.keys(monthlyData)
            .sort()
            .map((key) => ({
                year: key.split('-')[0], // 연도 추출
                month: key.split('-')[1] + '월', // 월 추출 (디스플레이용)
                count: monthlyData[key],
            }));

        setAllData(result);

        // 데이터가 있다면 가장 최근 연도를 초기값으로 설정
        if (result.length > 0) {
            setSelectedYear(result[result.length - 1].year);
        }
    }, [myBooks, uid, loading]);

    // 사용 가능한 연도 목록 추출
    const availableYears = useMemo(() => {
        return Array.from(new Set(allData.map((d) => d.year))).sort((a, b) => b.localeCompare(a));
    }, [allData]);

    // 선택된 연도에 해당하는 데이터만 필터링
    const filteredData = useMemo(() => {
        return allData.filter((d) => d.year === selectedYear);
    }, [allData, selectedYear]);

    return (
        <div>
            {/* 상단 컨트롤 바 */}
            <div className="flex items-center justify-between mb-6 px-4">
                <h3 className="text-lg font-bold text-slate-800">독서 기록 통계</h3>
                <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="bg-slate-50 border border-slate-200 text-slate-600 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 outline-none">
                    {availableYears.map((year) => (
                        <option key={year} value={year}>
                            {year}년
                        </option>
                    ))}
                </select>
            </div>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={filteredData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6a7282', fontSize: 15 }} dy={5} />
                    <YAxis axisLine={false} tickLine={false} tick={false} />
                    <Bar dataKey="count" fill="#bee3f8" barSize={40} radius={[6, 6, 0, 0]} animationDuration={1000}>
                        {filteredData.map((el, idx) => (
                            <Cell key={`cell-${idx}`} fill={el.count > 0 ? '#63b3ed' : '#bee3f8'} />
                        ))}
                        <LabelList dataKey="count" position="top" fill="#6a7282" fontSize={15} fontWeight="bold" offset={8} />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
