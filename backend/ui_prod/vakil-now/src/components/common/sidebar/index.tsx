'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { SidebarProps } from './interfaces/interface';
import ItemRow from './itemRow';

export default function Sidebar ({
  menu,
  itemClassName,
  subItemClassName,
  sidebarClassName
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <aside
      className={cn(
        'relative bg-[#0A3A73] p-4 pt-20 h-full overflow-hidden',
        sidebarClassName
      )}>
      {/* 🔹 Decorative SVGs */}
      <Image
        src='/userDashboard/sidebar/scale.svg'
        alt=''
        width={100}
        height={100}
        className='absolute top-80 left-6  pointer-events-none md:top-[22%]
    lg:top-[52%]
'
      />

      <Image
        src='/userDashboard/sidebar/balance.svg'
        alt=''
        width={100}
        height={100}
        className='absolute top-100 left-48  pointer-events-none md:top-[50%]
    lg:top-[60%]'
      />

      <Image
        src='/userDashboard/sidebar/gavel.svg'
        alt=''
        width={100}
        height={100}
        className='absolute top-120 left-15 pointer-events-none  md:top-[74%]
    lg:top-[85%]'
      />

      {/* 🔹 Menu */}
      <div className='relative z-10 flex flex-col gap-2'>
        {menu?.map((item, index) => {
          const isActive =
            pathname === item.href ||
            item.children?.some((child) => pathname === child.href);

          const isOpen = openIndex === index || isActive;

          return (
            <ItemRow
              key={index}
              label={item.label}
              icon={item.icon}
              active={isActive}
              open={isOpen}
              hasChildren={!!item.children}
              itemClassName={itemClassName}
              onClick={() => {
                if (item.children) {
                  setOpenIndex(isOpen ? null : index);
                } else if (item.href) {
                  router.push(item.href);
                }
              }}>
              {item.children?.map((sub, subIndex) => {
                const subActive = pathname === sub.href;

                return (
                  <div
                    key={subIndex}
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(sub.href);
                    }}
                    className={cn(
                      'py-1 px-2 rounded cursor-pointer transition',
                      subItemClassName || 'text-sm',
                      subActive
                        ? 'bg-white text-[#0A3A73] font-semibold'
                        : 'text-white/80 hover:bg-white/10'
                    )}>
                    {sub.label}
                  </div>
                );
              })}
            </ItemRow>
          );
        })}
      </div>
    </aside>
  );
}
