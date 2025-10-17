import Write from '@/components/units/write';
import { getFirestore, doc, getDoc } from 'firebase/firestore/lite';
import { firebaseApp } from '@/components/commons/libraries/firebase';
import { IBookPath } from '@/types/bookPath';
import { IBookItems } from '@/types/bookItems';

interface EditPageProps {
    params: { isbn: string };
}

export default async function EditPage({ params }: EditPageProps) {
    const firestore = getFirestore(firebaseApp);
    const docRef = doc(firestore, 'bookPath', params.isbn);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return <p>책 정보를 찾을 수 없습니다.</p>;

    const bookData = docSnap.data() as IBookPath;

    // IBookItems 타입으로 맞춰서 전달
    const book: IBookPath = {
        uid: bookData.uid,
        isbn: bookData.isbn,
        writer: bookData.writer,
        image: bookData.image,
        title: bookData.title,
        content: bookData.title,
        date: bookData.title,
    };

    return <Write mode="edit" book={book} />;
}
