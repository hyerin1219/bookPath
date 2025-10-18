import { firebaseApp } from '@/components/commons/libraries/firebase';
import Detail from '@/components/units/detail';
import { IBookPath } from '@/types/bookPath';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

interface PageProps {
    params: { isbn: string };
}

export default async function DetailPage({ params }: PageProps) {
    const firestore = getFirestore(firebaseApp);
    const docRef = doc(firestore, 'bookPath', params.isbn);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return <p>책 정보를 찾을 수 없습니다.</p>;

    const book = docSnap.data() as IBookPath;

    return <Detail book={book} />;
}
