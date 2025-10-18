import { IBookItems } from '@/types/bookItems';

interface BookItemProps {
    el: IBookItems;
    onClick?: () => void;
}

function BookItem({ el, onClick }: BookItemProps) {
    return (
        <div onClick={onClick} className="flex-shrink-0 flex flex-col items-center text-center w-[150px] cursor-pointer">
            <div
                className="w-full h-[213px] rounded-md bg-white border border-[rgba(0,0,0,0.3)] 
                            shadow-[inset_-4px_-4px_0px_rgba(0,0,0,0.3)] overflow-hidden"
            >
                <img className="w-[calc(100%-4px)] h-[calc(100%-4px)] object-cover rounded-[5px_2px_5px_2px] transition-transform duration-300 ease-in-out hover:scale-110" src={el.image} alt={`${el.title} 표지`} />
            </div>
            <div className="w-full break-keep-all">
                <p className="overflow-hidden text-ellipsis break-words" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {el.title}
                </p>
                <p className="text-[#888] text-sm">
                    {el.author} | {el.publisher}
                </p>
            </div>
        </div>
    );
}

export { BookItem };
