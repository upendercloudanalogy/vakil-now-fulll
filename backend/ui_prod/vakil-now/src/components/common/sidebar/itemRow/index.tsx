'use client';

import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ItemRowProps } from '../interfaces/interface';

export default function ItemRow({
  label,
  icon: Icon,
  active,
  open,
  hasChildren,
  onClick,
  children,
  itemClassName
}: ItemRowProps) {
  return (
    <div>
      <div
        onClick={onClick}
        className={cn(
          'flex items-center justify-between py-2 px-4 cursor-pointer rounded transition',
          active
            ? 'bg-[#CC8809] text-white font-semibold'
            : 'text-white hover:bg-white/10',
          itemClassName
        )}>
        <div className='flex items-center gap-2'>
          {active ? (
            Icon && <Icon size={16} />
          ) : hasChildren ? (
            open ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )
          ) : (
            <ChevronRight size={16} />
          )}
          <span>{label}</span>
        </div>
      </div>

      {open && children && <div className='ml-6 mt-1'>{children}</div>}
    </div>
  );
}
