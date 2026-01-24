import Detail from '@/components/units/detail';

export default async function DetailPage({ params }: { params: Promise<{ isbn: string }> }) {
    const { isbn } = await params;

    return <Detail isbn={isbn} />;
}
