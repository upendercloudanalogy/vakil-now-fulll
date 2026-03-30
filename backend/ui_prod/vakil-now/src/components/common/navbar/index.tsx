'use client';

import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { DesktopNavbar } from './desktopNavbar/DesktopNavbar';
import { MobileNavbar } from './mobileNavbar';

export function Navbar () {
  const [sidebarOpen, setSidebarOpen] = useState(false);



  return (
    <>
      {/* TOP NAVBAR */}
      <nav className='bg-[#0A2342] text-white w-full shadow-lg'>
        <div className='flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-20 py-4'>
          {/* Logo */}
          <Image
            src='/logo.svg'
            alt='VAKILNOW Logo'
            width={80}
            height={80}
            className='h-15 w-auto'
          />

          {/* Desktop Menu */}
          <DesktopNavbar
            menuItems={['Home', 'About Us', 'Document', 'Contact Us']}
          />

          {/* Mobile Menu Button */}
          <Button
            size='lg'
            onClick={() => setSidebarOpen(true)}
            className='md:hidden bg-[#0A2342] menu-button'>
            <Menu className='h-20 w-20 text-white' />
          </Button>
        </div>
      </nav>

      {/* MOBILE SIDEBAR */}
      <MobileNavbar
        menuItems={["Home", "About Us", "Document", "Contact Us"]}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
    </>
  );
}
