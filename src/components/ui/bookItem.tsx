import { IBookItems } from '@/types';

import Image from 'next/image';

interface BookItemProps {
    el: IBookItems;
    onClick?: () => void;
}

function BookItem({ el, onClick }: BookItemProps) {
    return (
        <div role="button" onClick={onClick} className="flex-shrink-0 flex flex-col items-center text-center w-[160px] cursor-pointer">
            <div className="relative w-full h-[255px] bg-[url('/images/img_book_ver2.png')] bg-contain bg-no-repeat m-2">
                <div className="absolute top-[0px] left-[0px] w-[151px] h-[208px] overflow-hidden rounded-lg border border-[2px] border-[#1D3255]">
                    <Image src={el.image} alt={`${el.title} 표지`} fill priority className="object-cover transition-transform duration-300 ease-in-out hover:scale-110" />
                </div>
            </div>

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
