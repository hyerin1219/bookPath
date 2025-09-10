import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

export function Slide() {
    const [emblaRef] = useEmblaCarousel(
        {
            align: "start",
            loop: true,
            containScroll: "keepSnaps",
        },
        [Autoplay({ delay: 3000, stopOnInteraction: false })]
    )

    const slideItem = [
        { title: "000" }, { title: "111" }, { title: "222" }, { title: "333" },
        { title: "444" }, { title: "555" }, { title: "666" }, { title: "777" },
    ]

    return (
        <div className="w-full overflow-hidden" ref={emblaRef}>
            <div className="flex gap-3">
                {slideItem.map((el, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0 flex items-center justify-center w-[150px] h-[213px]  rounded-md  bg-white  p-2 border  border border-[rgba(0,0,0,0.3)] shadow-[inset_-2px_-2px_0px_rgba(0,0,0,0.3)]"
                    >
                        {el.title}
                    </div>
                ))}
            </div>
        </div>
    )
}