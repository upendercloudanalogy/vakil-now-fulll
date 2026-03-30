'use client';
import { Card } from '@/components/ui/card';
import React from 'react';
import { SummaryItem } from './interfaces/index';

const SummaryInfo = ({ icon, name, number }: SummaryItem) => {
  return (
    <Card className='p-0 m-0 shadow-none rounded-none bg-transparent  border-0 justify-between flex-row gap-2'>
      <Card className='p-0 m-0 shadow-none rounded-none bg-transparent border-0 flex-row flex-shrink-0 gap-2'>
        <Card className='p-0 m-0 shadow-none rounded-none bg-transparent border-0 items-center justify-center'>
          {icon}
        </Card>
        <Card className='p-0 m-0 shadow-none rounded-none bg-transparent  border-0 text-[rgb(89,89,89)] font-semibold items-center justify-center'>
          {name}
        </Card>
      </Card>
      <Card className='p-0 m-0 shadow-none rounded-none bg-transparent  border-0  text-[rgb(89,89,89)]'>
        {number}
      </Card>
    </Card>
  );
};

export default React.memo(SummaryInfo);
