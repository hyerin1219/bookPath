import BookClubDetail from '@/components/units/bookClubDetail';

interface IBookClubDetailPageProps {
    params: { id: string };
}

export default async function BookClubDetailPage({ params }: IBookClubDetailPageProps) {
    const { id } = await params;

    return <BookClubDetail id={id} />;
}
