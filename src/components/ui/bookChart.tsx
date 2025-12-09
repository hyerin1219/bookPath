import { useEffect, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { useMyBooks } from '@/hooks/useMyBooks';

import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, LabelList, ResponsiveContainer } from 'recharts';

interface IChartData {
    month: string;
    count: number;
}

export function BookChart() {
    const [chartData, setChartData] = useState<IChartData[]>([]);
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
            const monthKey = format(dateObj, 'yyyy-MM');
            acc[monthKey] = (acc[monthKey] || 0) + 1;
            return acc;
        }, {});

        const result = Object.keys(monthlyData)
            .sort()
            .map((month) => ({ month, count: monthlyData[month] }));

        setChartData(result);
    }, [myBooks, uid, loading]);

    return (
        <div>
            <ResponsiveContainer className="mx-auto" width="80%" height={200}>
                <BarChart data={chartData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    {/* <Tooltip /> */}
                    <Bar dataKey="count" fill="#bee3f8" barSize={80}>
                        <LabelList dataKey="count" position="top" />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
