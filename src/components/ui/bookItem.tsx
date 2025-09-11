import { IBookItems } from "@/types/bookItems"

function BookItem({ el }: { el: IBookItems }) {
    return (
        <div key={el.isbn} className="flex-shrink-0 flex flex-col items-center text-center w-[150px]">
            <div className="w-full h-[213px] rounded-md bg-white border border-[rgba(0,0,0,0.3)] shadow-[inset_-4px_-4px_0px_rgba(0,0,0,0.3)] overflow-hidden">
                <img
                    className="w-[calc(100%_-_4px)] h-[calc(100%_-_4px)] object-cover"
                    src={el.image}
                    alt={`${el.title} 표지`}
                />
            </div>
            <div className="w-full break-keep-all">
                <p>{el.title.replace(/\(.*?\)/g, "")}</p>
                <p className="text-[#888] text-sm">{el.author} | {el.publisher}</p>
            </div>
        </div>
    )
}

export { BookItem }