'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';

interface CustomLinkProps {
  text: string;
  href: string;
  height?: string;
  width?: string;
  bgcolor?: string;
  textColor?: string;
  borderRadius?: string;
  hasTail?: boolean; // For speech bubble tail
  tailColor?: string; // Background color for the tail area (light blue in image)
  className?: string;
}

export function CustomLink ({
  text,
  href,
  height = '',
  width = '',
  bgcolor = 'bg-white',
  textColor = 'text-[#1565C0]',
  borderRadius = 'rounded-full',
  className
}: CustomLinkProps) {
  return (
    <Link href={href} className='block no-underline'>
      <div
        className={cn(
          'relative inline-flex items-center justify-center px-4 py-2 text-[#1565C0] font-medium',
          className,
          height,
          width,
          bgcolor,
          textColor,
          borderRadius
        )}>
        {text}
      </div>
    </Link>
  );
}
