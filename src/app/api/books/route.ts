import axios from 'axios';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';
    const sort = searchParams.get('sort') || 'date';
    const start = searchParams.get('start') || '1';

    try {
        const response = await axios.get('https://openapi.naver.com/v1/search/book.json', {
            params: {
                query,
                sort,
                start,
                display: 10,
            },
            headers: {
                'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID!,
                'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET!,
            },
        });

        return new Response(JSON.stringify(response.data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch' }), {
            status: 500,
        });
    }
}
