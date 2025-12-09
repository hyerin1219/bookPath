import { useState } from 'react';

import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

import { useBookData } from '@/hooks/useBookData';

import { BookItem } from './bookItem';
import Modal from './modal';

import { IBookItems } from '@/types/bookItems';

export function Slide() {
    const { bookData, loading } = useBookData('한국소설'); // 초기 키워드 "한국소설"
    const [selectedBook, setSelectedBook] = useState<IBookItems | null>(null);

    const [emblaRef] = useEmblaCarousel(
        {
            align: 'start',
            loop: true,
            containScroll: 'keepSnaps',
        },
        [Autoplay({ delay: 3000, stopOnInteraction: false })]
    );

    return (
        <div className="w-full">
            <div className="w-full overflow-hidden" ref={emblaRef}>
                <div className="flex space-x-4 px-4">
                    {loading
                        ? Array.from({ length: 10 }).map((_, i) => (
                              <div key={i} className="flex-shrink-0 flex flex-col items-center text-center w-[150px]">
                                  <div className="w-full h-[213px] rounded-md bg-[#eee] animate-pulse"></div>
                                  <div className="w-full h-5 mt-2 bg-[#ddd] rounded"></div>
                              </div>
                          ))
                        : bookData.map((el) => <BookItem onClick={() => setSelectedBook(el)} key={el.isbn} el={el} />)}
                </div>
            </div>

            <Modal selectedBook={selectedBook} setSelectedBook={setSelectedBook} />
        </div>
    );
}
