'use client';

import { Footer } from '@/components/common/footer';
import { Navbar } from '@/components/common/navbar';
import { Header } from '@/components/common/topBar';
import React from 'react';

export default function ServiceLayout ({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className='flex flex-col gap-20 md:gap-50'>
        <div className='flex flex-col gap-1 md:gap-10'>
          <div className='sticky top-0 z-40'>
            <Header phone='92XXXXXXXXX' email='vakil-now@gmail.com' />
            <Navbar />
          </div>
          <div>{children}</div>
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </>
  );
}
