'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const MotionLink = motion(Link);

const MenuLink = ({ el }: { el: { src: string; menu: string; active: boolean } }) => {
    return (
        <MotionLink
            style={{
                pointerEvents: el.active ? 'auto' : 'none',
            }}
            href={el.src}
            className="block w-[24%] rounded-xl bg-slate-100 p-4 text-center 
                 text-gray-700 font-medium shadow-sm break-keep-all
                 transition-all duration-200 hover:bg-blue-100"
            whileHover={{
                scale: 1.05,
                y: -4,
                boxShadow: '0px 6px 12px rgba(0,0,0,0.15)',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
            {el.menu}
        </MotionLink>
    );
};

export default MenuLink;
