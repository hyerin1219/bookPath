// app/detail/[isbn]/page.tsx
import { getFirestore, doc, getDoc } from 'firebase/firestore/lite';
import { firebaseApp } from '@/components/commons/libraries/firebase';
import { IBookPath } from '@/types/bookPath';
import { BookItem02 } from '@/components/ui/bookItem02';
import { Button } from '@/components/ui/button';

interface DetailPageProps {
    params: { isbn: string };
}

export default async function DetailPage({ params }: DetailPageProps) {
    const { isbn } = params;
    const firestore = getFirestore(firebaseApp);
    const docRef = doc(firestore, 'bookPath', isbn);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return <p>책 정보를 찾을 수 없습니다.</p>;
    }

    const book = docSnap.data() as IBookPath;

    return (
        <div className="size-full ">
            {/* 책 정보 */}
            <div className="w-full flex justify-center items-center gap-10">
                <div
                    className="flex-shrink-0 w-[150px] h-[213px] rounded-md bg-white border border-[rgba(0,0,0,0.3)] 
                            shadow-[inset_-4px_-4px_0px_rgba(0,0,0,0.3)] overflow-hidden"
                >
                    <img className="w-[calc(100%-4px)] h-[calc(100%-4px)] object-cover rounded-[5px_2px_5px_2px]" src={book.img} alt={`${book.title} 표지`} />
                </div>
                <div className="flex flex-col gap-2 text-left">
                    <div>
                        <span className="font-bold text-xl">Title</span> <span className="border-b-2">{book.title}</span>
                    </div>
                    <div>
                        <span className="font-bold text-xl">Writer</span> <span className="border-b-2">{book.writer ? book.writer : '-'}</span>
                    </div>
                    {/* <div>
                        <span className="font-bold text-xl">Date</span> <span className="border-b-2">{Today.toLocaleDateString()}</span>
                    </div> */}
                    <div className="inline-flex ">
                        <span className="font-bold text-xl mr-1">Rating</span>
                        <p>
                            <button className="w-7 h-7 bg-[url('/images/write/icon_rating.png')] bg-contain bg-no-repeat"></button>
                        </p>
                    </div>
                </div>
            </div>

            {/* 입력 칸 */}
            <div className="w-full h-130  bg-[url('/images/write/bg_grid.png')] bg-cover bg-no-repeat  mt-10 mb-5">
                <div className="p-2 size-full overflow-y-auto">{book.content}</div>
            </div>

            <div className="flex justify-end items-center gap-3">
                <Button variant="submit">수정</Button>
                <Button variant="close">삭제</Button>
            </div>
        </div>
    );
}
