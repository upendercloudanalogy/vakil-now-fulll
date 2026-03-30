'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { BookedConsultation } from './interfaces/index';

const ConsultationItem = ({ name, role, image }: BookedConsultation) => {
  return (
    <Card className='p-0 m-0 grid grid-cols-[auto_1fr] border-0 shadow-none rounded-none bg-transparent gap-3  w-full min-w-0 '>
      <Image
        src={image}
        width={40}
        height={40}
        alt={name}
        className='object-contain rounded-full flex shrink-0'
      />
      <Card className='p-0 m-0 flex-col border-0 shadow-none rounded-none bg-transparent gap-0  min-w-0 overflow-hidden'>
        <Card
          className='text-[rgb(89,89,89)] p-0 m-0 border-0 shadow-none rounded-none bg-transparent items-center justify-center
    font-inter font-semibold
    text-base          
    sm:text-md
    md:text-md         
    lg:text-lg         
    xl:text-xl   min-w-0 overflow-hidden '>
          <span className='truncate block w-full' title={name}>
            {name}
          </span>
        </Card>
        <Card
          className='text-[rgb(142,143,145)] p-0 m-0 border-0 shadow-none rounded-none bg-transparent
    font-inter font-medium
    sm:text-sm
    md:text-sm         
    lg:text-md         
    xl:text-lg  
    min-w-0 overflow-hidden '>
          <span className='truncate block w-full max-w-[25ch] '>{role}</span>
        </Card>
      </Card>
    </Card>
  );
};

export default React.memo(ConsultationItem);
