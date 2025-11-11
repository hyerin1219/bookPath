import { Dispatch, SetStateAction } from 'react';
import ImageUploading, { ImageType } from 'react-images-uploading';
import { Button } from './button';

interface IImageUploadProps {
    images: ImageType[];
    setImages: Dispatch<SetStateAction<ImageType[]>>;
}

const ImageUpload = ({ setImages, images }: IImageUploadProps) => {
    const maxNumber = 5;

    const onChange = (imageList: any, addUpdatedIndex?: number[]) => {
        setImages(imageList);
    };

    return (
        <ImageUploading multiple value={images} onChange={onChange} maxNumber={maxNumber}>
            {({ imageList, onImageUpload, onImageRemoveAll, onImageRemove }) => (
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <p>사진</p>
                        <Button type="button" onClick={onImageUpload} className="mb-2">
                            사진 추가하기
                        </Button>
                    </div>
                    <div className="flex gap-3 items-center">
                        {imageList.map((image, index) => (
                            <div className="relative" key={index}>
                                <img src={image.dataURL} alt="" width="100" />
                                <button className="absolute top-[5px] right-[5px] w-[30px] h-[30px] bg-white rounded-full bg-[url('/images/button_close.png')] bg-contain bg-no-repeat flex items-center justify-center hover:scale-110 hover:shadow-md transition-transform" onClick={() => onImageRemove(index)} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </ImageUploading>
    );
};

export default ImageUpload;
