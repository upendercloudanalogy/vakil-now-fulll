'use client';

import { AppSidebar } from '@/components/common/SidebarAdmin/index';
import { SidebarProvider, useSidebar } from '@/components/ui/sidebar';
import React from 'react';
import Image from 'next/image';
import { Menu } from 'lucide-react';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Dummy menu items

  return (
    <SidebarProvider
      defaultOpen
      width='clamp(180px, 20vw, 267px)'
      backGroundColourOfSidebar='rgb(10,35,66)'>
      <ResponsiveLayout>{children}</ResponsiveLayout>
    </SidebarProvider>
  );
}

function ResponsiveLayout({ children }: { children: React.ReactNode }) {
  const { toggleSidebar } = useSidebar();

  return (
    // <div className="w-full h-svh">

    //   {/* DESKTOP */}
    //   <div className="hidden md:flex flex-row h-full min-w-0">
    //     <AppSidebar />

    //     <main className="flex-1 min-w-0 z-0 overflow-y-auto overflow-x-hidden bg-white">
    //       {children}
    //     </main>
    //   </div>

    //   {/* MOBILE */}
    //   <div className="flex flex-col md:hidden h-full">
    //     {/* Top Navbar */}
    //     <div className="flex justify-between bg-[rgb(10,35,66)] px-4 py-5">
    //       {/* Logo */}
    //       <div>
    //         <Image
    //           src="/logo.svg"
    //           alt="Dashboard Icon"
    //           width={64}
    //           height={45}
    //           className="object-contain"
    //         />
    //       </div>

    //       {/* Menu Trigger → toggles SidebarProvider */}
    //       <div
    //         onClick={toggleSidebar}
    //         className="text-white h-[40px] w-[40px] flex justify-center items-center active:scale-90 transition
    //          outline-none focus:outline-none focus-visible:outline-none
    // ring-0 focus:ring-0 focus-visible:ring-0"
    //  tabIndex={0}
    //       >
    //         <Menu className="w-[24px] h-[24px]" />
    //       </div>
    //     </div>

    //     {/* Page Content */}
    //     <main className="flex-1 min-w-0 z-0 overflow-y-auto overflow-x-hidden bg-white">
    //       {children}
    //     </main>
    //   </div>

    // </div>

    <div className='w-full h-svh'>
      <div className='flex h-full min-w-0'>
        {/* Sidebar (Desktop only) */}
        <div className='hidden md:flex'>
          <AppSidebar />
        </div>

        {/* Main Content */}
        <main className='flex-1 min-w-0 z-0 overflow-y-auto overflow-x-hidden bg-white'>
          {/* Mobile Navbar */}
          <div className='md:hidden flex justify-between items-center bg-[rgb(10,35,66)] px-4 py-5'>
            <Image
              src='/logo.svg'
              alt='Dashboard Logo'
              width={64}
              height={45}
              className='object-contain'
            />

            <button
              onClick={toggleSidebar}
              className='text-white h-[40px] w-[40px] flex justify-center items-center
                active:scale-90 transition
                outline-none focus:outline-none focus-visible:outline-none
                ring-0 focus:ring-0 focus-visible:ring-0'>
              <Menu className='w-[24px] h-[24px]' />
            </button>
          </div>

          {/* PAGE CONTENT (RENDERED ONCE) */}
          {children}
        </main>
      </div>
    </div>
  );
}
