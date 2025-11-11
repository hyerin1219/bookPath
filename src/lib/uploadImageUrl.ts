import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firebaseApp } from '@/components/commons/libraries/firebase';

const storage = getStorage(firebaseApp);

/** Storage에 이미지 업로드 후 URL 반환 */
export const uploadImageUrl = async (file: File) => {
    if (!file) return null;

    try {
        const storageRef = ref(storage, `uploads/${Date.now()}-${file.name}`);
        await uploadBytes(storageRef, file);
        const imgUrl = await getDownloadURL(storageRef);
        return imgUrl;
    } catch (error) {
        console.error('이미지 업로드 실패:', error);
        return null;
    }
};
