import { firebaseApp } from '@/components/commons/libraries/firebase';
import BookClubBoardDetail from '@/components/units/bookClubBoardDetail';

import { getFirestore, doc, getDoc } from 'firebase/firestore';

import { IBookClubBoard } from '@/types';

interface IBookClubBoardDetailProps {
    params: { id: string };
}

export default async function BookClubBoardDetailPage({ params }: IBookClubBoardDetailProps) {
    const { id } = params;
    const firestore = getFirestore(firebaseApp);

    const docRef = doc(firestore, 'bookClubBoard', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return <p>게시글을 찾을 수 없습니다.</p>;

    const boardData: IBookClubBoard = {
        id: docSnap.id,
        ...(docSnap.data() as Omit<IBookClubBoard, 'id'>),
    };

    return <BookClubBoardDetail board={boardData} id={id} />;
}
