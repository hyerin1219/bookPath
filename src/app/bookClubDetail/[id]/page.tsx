import BookClubDetail from '@/components/units/bookClubDetail';
import { firebaseApp } from '@/components/commons/libraries/firebase';

import { doc, getDoc, getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { IBookClub } from '@/types/bookClub';
import { IBookClubBoard } from '@/types/bookClubBoard';

interface IBookClubDetailProps {
    params: { id: string };
}

export default async function BookClubDetailPage({ params }: IBookClubDetailProps) {
    const { id } = params;
    const firestore = getFirestore(firebaseApp);

    // bookClub
    const docRef = doc(firestore, 'bookClub', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return <p>책갈피 모임을 찾을 수 없습니다.</p>;
    const bookClubData = docSnap.data() as IBookClub;

    // bookClubBoard (모임 ID 기준으로 여러 게시글 가져오기)
    const boardColRef = collection(firestore, 'bookCluBoard');
    const q = query(boardColRef, where('clubId', '==', id));
    const querySnapshot = await getDocs(q);

    const bookClubBoard: IBookClubBoard[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<IBookClubBoard, 'id'>),
    }));

    return <BookClubDetail bookClubData={bookClubData} bookClubBoard={bookClubBoard} />;
}
