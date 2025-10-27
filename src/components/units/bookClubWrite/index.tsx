'use client';
import { useState } from 'react';

import { collection, getFirestore, addDoc, updateDoc } from 'firebase/firestore';
import { firebaseApp } from '@/components/commons/libraries/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import Alert from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useAlert } from '@/hooks/useAlert';
import ImageUpload from '@/components/ui/imageUpload';

import { ImageType } from 'react-images-uploading';
import { useSearchParams } from 'next/navigation';

export default function BookClubWrite() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { showAlert, alertValue, triggerAlert } = useAlert();

    const [images, setImages] = useState<ImageType[]>([]);

    const searchParams = useSearchParams();
    const clubId = searchParams.get('clubId');

    const firestore = getFirestore(firebaseApp);
    const storage = getStorage(firebaseApp);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            triggerAlert('제목을 입력해주세요!');
            return;
        }

        if (!content.trim()) {
            triggerAlert('내용을 입력해주세요!');
            return;
        }
        try {
            const imageURLs = images.map((img) => img.dataURL);

            const docRef = await addDoc(collection(firestore, 'bookCluBoard'), {
                title,
                content,
                images: imageURLs,
                clubId,
            });
            // 문서 ID를 필드에 저장
            await updateDoc(docRef, { id: docRef.id });

            setTitle('');
            setContent('');
            setImages([]);
            triggerAlert('게시글이 등록되었습니다!');
        } catch (error) {
            if (error instanceof Error) alert(error.message);
        }
    };
    return (
        <div className="size-full">
            <div className="mb-5">게시글 등록하기</div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="w-full flex items-center gap-2 ">
                    <p>제목</p>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" className="bg-[#eee] shadow-[inset_2px_2px_0px_rgba(0,0,0,0.3)] p-2 py-1 rounded-xl w-[90%]" />
                </div>
                <div className="w-full flex  gap-2 ">
                    <p>내용</p>
                    <textarea rows={15} spellCheck="false" value={content} onChange={(e) => setContent(e.target.value)} className="bg-[#eee] shadow-[inset_2px_2px_0px_rgba(0,0,0,0.3)] p-2 py-1  rounded-xl w-[90%] custom-scroll" />
                </div>
                <div className="w-full flex  gap-2">
                    <p>사진</p>

                    <ImageUpload images={images} setImages={setImages} />
                </div>

                <div className="text-right">
                    <Button type="submit" variant="submit" className="mt-5">
                        등록
                    </Button>
                </div>
            </form>

            {showAlert && <Alert alertValue={alertValue} />}
        </div>
    );
}
