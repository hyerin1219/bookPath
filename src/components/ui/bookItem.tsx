import { IBookItems } from '@/types';
import Image from 'next/image';

interface BookItemProps {
    el: IBookItems;
    onClick?: () => void;
}

function BookItem({ el, onClick }: BookItemProps) {
    return (
        <div role="button" onClick={onClick} className="flex-shrink-0 flex flex-col items-center text-center w-[163px] cursor-pointer">
            <div className="relative w-full h-[213px] rounded-md bg-white border border-[rgba(0,0,0,0.3)]  shadow-[inset_-4px_-4px_0px_rgba(0,0,0,0.3)] overflow-hidden">
                <Image src={el.image} alt={`${el.title} 표지`} loading="lazy" width={146} height={209} className="w-[calc(100%-4px)] h-[calc(100%-4px)] object-cover rounded-[5px_2px_5px_2px] transition-transform duration-300 ease-in-out hover:scale-110" />
            </div>
            {/* <div className="relative w-[163px] h-[213px] bg-[url('/images/img_book.png')] bg-contain bg-no-repeat">
                <span className="absolute top-[0px] left-[8px]  inline-block w-[2px] h-full bg-black z-1 shadow-[-2px_-2px_6px_rgba(0,0,0,0.5)]"></span>
                <div className="absolute top-[1.5px] left-[1.5px] w-[147px] h-[210px] overflow-hidden rounded-[5px]">
                    <Image src={el.image} alt={`${el.title} 표지`} loading="lazy" fill className="object-cover rounded-[5px_2px_5px_2px] transition-transform duration-300 ease-in-out hover:scale-110" />
                </div>
            </div> */}

            <div className="w-full break-keep-all">
                <p className="overflow-hidden text-ellipsis break-words" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {el.title}
                </p>
                <p
                    className="text-[#888] text-sm overflow-hidden text-ellipsis"
                    style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                    }}
                >
                    {el.author && el.author} {el.author && el.publisher ? '|' : ''} {el.publisher && el.publisher}
                </p>
            </div>
        </div>
    );
}

export { BookItem };
