import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function POST(req: Request) {
    try {
        const { content } = await req.json();

        const result = await generateText({
            model: google('gemini-3-flash-preview'),
            system: `너는 독서 감상문 전문 에디터야. 
            원문의 의도를 해치지 않으면서 맞춤법을 교정하고 문체를 더 세련되게 다듬어줘.
            결과는 교정된 문장만 출력해.`,
            prompt: content,
        });

        return Response.json({ refinedText: result.text });
    } catch (error: any) {
        console.error('AI API 에러 발생:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}
