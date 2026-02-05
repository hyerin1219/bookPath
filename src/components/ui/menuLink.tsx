'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

const MotionLink = motion(Link);

interface IMenuLinkProps {
    onSelect: () => void;
}

const MenuLink = ({ onSelect }: IMenuLinkProps) => {
    const Menu = [
        { src: '/', menu: '홈', icon: 'home' },
        { src: '/search', menu: '책 찾아보기', icon: 'search' },
        { src: '/search', menu: '독후감 쓰기', icon: 'write' },
        { src: '/myBookPath', menu: '나의 책갈피', icon: 'my' },
        { src: '/bookClub', menu: '책갈피 모임', icon: 'bookClub' },
    ];

    return (
        <div className="flex flex-col gap-5">
            {Menu.map((el) => (
                <MotionLink key={el.icon} href={el.src} onClick={onSelect} className="flex items-center gap-3 text-gray-700 font-medium group" transition={{ type: 'spring', stiffness: 300, damping: 15 }}>
                    <span className="rounded-xl bg-[#eee] w-9 h-9 flex items-center justify-center group-hover:bg-yellow-100 transition">
                        <Image alt={`${el.menu} 아이콘`} width={20} height={20} className="" src={`/images/icon_${el.icon}.png`} />
                    </span>
                    <span>{el.menu}</span>
                </MotionLink>
            ))}
        </div>
    );
};

export default MenuLink;
