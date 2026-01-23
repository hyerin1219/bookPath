import BookClubBoardDetail from '@/components/units/bookClubBoardDetail';

interface IBookClubBoardDetailProps {
    params: { id: string };
}

export default async function BookClubBoardDetailPage({ params }: IBookClubBoardDetailProps) {
    const { id } = await params;

    return <BookClubBoardDetail id={id} />;
}
