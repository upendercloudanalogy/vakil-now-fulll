'use client';

import Link from 'next/link';
import { X, Phone } from 'lucide-react';
import { FancyButton } from '../navbarbtn/page.';
import { MobileSidebarProps } from '../interfaces/interface';

export function MobileNavbar({
  sidebarOpen,
  setSidebarOpen,
  menuItems
}: MobileSidebarProps) {
  return (
    <>
      {/* SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-full w-[280px] bg-[#0A2342] text-white shadow-2xl transform 
        ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
        transition-transform duration-300 z-50`}>
        {/* Close Button */}
        <div className='flex justify-end p-4'>
          <X
            className='h-7 w-7 cursor-pointer hover:text-orange-300'
            onClick={() => setSidebarOpen(false)}
          />
        </div>

        {/* Menu Items */}
        <div className='flex flex-col space-y-5 text-lg px-6'>
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={`/${item.toLowerCase()}`}
              className='hover:text-orange-300'>
              {item}
            </Link>
          ))}

          <div className='pt-4'>
            <FancyButton height='h-15' width='w-full' fontSize='text-lg'>
              <Phone className='h-4 w-4' /> Talk To Lawyer
            </FancyButton>
          </div>
        </div>
      </div>

      {/* DARK OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className='fixed inset-0 bg-transparent bg-opacity-40 md:hidden z-40'
        />
      )}
    </>
  );
}
