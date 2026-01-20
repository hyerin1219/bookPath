import { getFirestore, doc, getDoc } from 'firebase/firestore/lite';
import { firebaseApp } from '@/components/commons/libraries/firebase';
import BookClubWrite from '@/components/units/bookClubWrite';
import { IBookClubBoard } from '@/types';

interface EditPageProps {
    params: { id: string };
}

export default async function BoardEditPage({ params }: EditPageProps) {
    const firestore = getFirestore(firebaseApp);
    const docRef = doc(firestore, 'bookClubBoard', params.id);
    const docSnap = await getDoc(docRef);
    const bookClubBoardData = docSnap.data() as IBookClubBoard;

    return <BookClubWrite mode="edit" bookClubBoardData={bookClubBoardData} />;
}
