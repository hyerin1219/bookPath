import Detail from '@/components/units/detail';

interface IDetailPageProps {
    params: { isbn: string };
}

export default function DetailPage({ params }: IDetailPageProps) {
    return <Detail isbn={params.isbn} />;
}
