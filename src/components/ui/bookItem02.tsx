import { IBookItems } from '@/types';
import Image from 'next/image';

interface BookItem02Props {
    el: IBookItems;
    className?: string;
    scale: boolean;
}

function BookItem02({ el, className, scale }: BookItem02Props) {
    return (
        <div className={`${className} '}`}>
            <div className=" size-full rounded-md bg-white border border-[rgba(0,0,0,0.3)]  shadow-[inset_-4px_-4px_0px_rgba(0,0,0,0.3)] overflow-hidden ">
                <div className="relative w-[calc(100%-4px)] h-[calc(100%-4px)]">
                    <Image src={el.image} alt={`${el.title} 표지`} fill loading="lazy" className={`object-cover rounded-[5px_2px_5px_2px] transition-transform duration-300 ease-in-out ${scale ? 'hover:scale-110' : ''}`} />
                </div>
            </div>
        </div>
    );
}

export { BookItem02 };
