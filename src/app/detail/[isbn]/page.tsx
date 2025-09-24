import Detail from '@/components/units/detail';

interface PageProps {
    params: { isbn: string };
}

export default function DetailPage({ params }: PageProps) {
    return <Detail params={params} />;
}
