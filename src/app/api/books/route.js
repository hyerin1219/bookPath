import axios from 'axios';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';

    try {
        const response = await axios.get('https://openapi.naver.com/v1/search/book.json', {
            params: { query },
            headers: {
                'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
                'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
            },
        });

        return new Response(JSON.stringify(response.data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Failed to fetch' }), { status: 500 });
    }
}
