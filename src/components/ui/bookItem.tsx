import { IBookItems } from '@/types/bookItems';

interface BookItemProps {
    el: IBookItems;
    onClick?: () => void; // 🔥 클릭 이벤트 props 추가
}

function BookItem({ el, onClick }: BookItemProps) {
    return (
        <div onClick={onClick} key={el.isbn} className="flex-shrink-0 flex flex-col items-center text-center w-[150px] cursor-pointer">
            <div
                className="w-full h-[213px] rounded-md bg-white border border-[rgba(0,0,0,0.3)] 
                            shadow-[inset_-4px_-4px_0px_rgba(0,0,0,0.3)] overflow-hidden"
            >
                <img className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-110" src={el.image} alt={`${el.title} 표지`} />
            </div>
            <div className="w-full break-keep-all">
                <p>{el.title.replace(/\(.*?\)/g, '')}</p>
                <p className="text-[#888] text-sm">
                    {el.author} | {el.publisher}
                </p>
            </div>
        </div>
    );
}

export { BookItem };
