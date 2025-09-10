import { Slide } from "@/components/ui/slide";
import { useBookApi } from "@/hooks/useBookApi";
import Link from "next/link";

export default function Dashboard() {
    const { books } = useBookApi();

    console.log("books", books)

    const Menu = [
        { src: "search", menu: "책 검색하기" },
        { src: "write", menu: "독후감 쓰기" },
        { src: "myBookPath", menu: "나의 책갈피" },
        { src: "bookClub", menu: "책갈피 모임" },
    ]
    return (
        <div>
            <section>
                <div>
                    <div className="text-2xl mb-3">오늘의 책을 소개합니다!</div>
                    <Slide />
                </div>
            </section>

            <section className="mt-10">
                <div className="flex items-center justify-between mt-5 text-2xl ">
                    {
                        Menu.map((el) => (
                            <Link key={el.src} href={el.src} className="w-[24%] rounded-md p-2 bg-[#eee] hover:bg-[#ffd1ba]">{el.menu}</Link>
                        ))
                    }
                </div>
            </section>
        </div>
    )
}