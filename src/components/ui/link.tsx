import * as React from 'react';
import Link from 'next/link'; // Next.js Link 임포트
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const linkVariants = cva('inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm shadow-[2px_2px_6px_rgba(0,0,0,0.1)] cursor-pointer transition-colors', {
    variants: {
        variant: {
            default: 'bg-[#faf8da] hover:bg-[#f2f0c9]',
            search: 'bg-[#a8e6cf] hover:bg-[#96d4bd]',
            submit: 'bg-[#bee3f8] hover:bg-[#abd1e6]',
            close: 'bg-[#D9D9D9] hover:bg-[#cccccc]',
        },
        size: {
            default: 'h-9 px-4 py-2 has-[>svg]:px-3',
            sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
            lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
            icon: 'size-9',
        },
    },
    defaultVariants: {
        variant: 'default',
        size: 'default',
    },
});

interface LinkBoxProps extends React.ComponentProps<typeof Link>, VariantProps<typeof linkVariants> {
    asChild?: boolean;
}

function LinkBox({ className, variant, size, asChild = false, ...props }: LinkBoxProps) {
    const Comp = asChild ? Slot : Link;

    return <Comp className={cn(linkVariants({ variant, size, className }))} {...props} />;
}

export { LinkBox, linkVariants };
