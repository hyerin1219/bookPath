import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useBookApi } from '@/hooks/useBookApi';
import { IBookItems } from '@/types/bookItems';

export function Slide() {

    const { bookData, loading } = useBookApi();

    console.log("bookData", bookData)


    const [emblaRef] = useEmblaCarousel(
        {
            align: "start",
            loop: true,
            containScroll: "keepSnaps",
        },
        [Autoplay({ delay: 3000, stopOnInteraction: false })]
    )


    return (
        <div className="w-full overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
                {
                    loading ?
                        Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className='flex-shrink-0 flex flex-col items-center text-center w-[150px]'>
                                <div className="w-full h-[213px] rounded-md bg-[#eee] animate-pulse"></div>
                                <div className='w-full h-5 mt-2 bg-[#ddd] rounded'></div>
                            </div>
                        ))
                        :
                        bookData.map((el) => (
                            <div key={el.isbn} className='flex flex-col items-center text-center w-[150px] '>
                                <div className="w-full h-[213px] rounded-md bg-white border border-[rgba(0,0,0,0.3)] shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.3)] overflow-hidden flex items-center justify-center">
                                    <img className='size-full object-cover' src={el.image} alt={`${el.title} 표지`} />
                                </div>
                                <div className='w-full overflow-hidden whitespace-nowrap hover:animate-scroll'>
                                    <span className='inline-block '>{el.title}</span>
                                </div>
                            </div>
                        ))
                }

            </div>
        </div>
    )
}