import MenuLink from '@/components/ui/menuLink';
import { Slide } from '@/components/ui/slide';

import { useAuth } from '@/hooks/useAuth';
export default function Dashboard() {
    // const { uid } = useAuth();

    const Menu = [
        { src: 'search', menu: '책 찾아보기' },
        { src: 'search', menu: '독후감 쓰기' },
        { src: 'myBookPath', menu: '나의 책갈피' },
        { src: 'bookClub', menu: '책갈피 모임' },
    ];
    return (
        <div>
            <section>
                <div>
                    <div className="text-2xl mb-3">오늘의 책을 소개합니다!</div>
                    <Slide />
                </div>
            </section>

            <section className="mt-5 w-full">
                <div className="flex items-center justify-between mt-5 text-2xl w-full">
                    {Menu.map((el) => (
                        <MenuLink el={el} key={el.menu} />
                    ))}
                </div>
            </section>

            {/* {uid && (
                <section className="mt-5 w-full">
                    <div className="text-2xl mb-3">나의 책갈피</div>
                </section>
            )} */}
        </div>
    );
}
