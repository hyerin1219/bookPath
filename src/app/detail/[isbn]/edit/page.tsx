import Write from '@/components/units/write';

export default async function EditPage({ params }: { params: Promise<{ isbn: string }> }) {
    const { isbn } = await params;

    return <Write mode="edit" isbn={isbn} />;
}
