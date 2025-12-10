import { IBookItems } from '@/types/bookItems';

interface BookItem02Props {
    el: IBookItems;
    className?: string;
    scale: boolean;
}

function BookItem02({ el, className, scale }: BookItem02Props) {
    return (
        <div className={`${className} '}`}>
            <div
                className="size-full rounded-md bg-white border border-[rgba(0,0,0,0.3)] 
                            shadow-[inset_-4px_-4px_0px_rgba(0,0,0,0.3)] overflow-hidden"
            >
                <img className={`w-[calc(100%-4px)] h-[calc(100%-4px)] object-cover rounded-[5px_2px_5px_2px] transition-transform duration-300 ease-in-out  ${scale ? 'hover:scale-110' : 'hover:scale-100'}`} src={el.image} alt={`${el.title} 표지`} />
            </div>
        </div>
    );
}

export { BookItem02 };
