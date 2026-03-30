'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { FancyButtonProps } from '../interfaces/interface';

export function FancyButton({
  height = 'h-10',
  width = 'w-40',
  borderRadius = 'rounded-none',
  fontSize = 'text-base',
  children,
  className
}: FancyButtonProps) {
  return (
    <div
      className={cn(
        'relative inline-block',
        borderRadius,
        ' border border-blue-900/20 pr-2 pb-2 overflow-hidden'
      )}>
      <Button
        className={cn(
          'relative z-10 bg-[#CC8909] text-white shadow-none border-none cursor-pointer',
          borderRadius,
          height,
          width,
          fontSize,
          'px-6 py-3 flex items-center gap-2 font-medium transition-all duration-200',
          'hover:bg-[#CC8909] hover:text-white',

          className
        )}>
        {children}
      </Button>

      <div className='absolute right-0 top-2 bottom-2 w-2 bg-white z-0' />
      <div className='absolute bottom-0 left-2 right-0 h-2 bg-white z-0' />
    </div>
  );
}
