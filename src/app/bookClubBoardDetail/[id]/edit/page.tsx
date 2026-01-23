import BookClubWrite from '@/components/units/bookClubWrite';

interface IBoardEditProps {
    params: { id: string };
}

export default function BoardEditPage({ params }: IBoardEditProps) {
    return <BookClubWrite mode="edit" id={params.id} />;
}
