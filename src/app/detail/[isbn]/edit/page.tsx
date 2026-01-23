import Write from '@/components/units/write';

interface IEditPageProps {
    params: { isbn: string };
}

export default function EditPage({ params }: IEditPageProps) {
    return <Write mode="edit" isbn={params.isbn} />;
}
