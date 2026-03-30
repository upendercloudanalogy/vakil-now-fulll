'use client';
import { Card } from '@/components/ui/card';
import SummaryInfo from './SummaryInfo';
import React from 'react';
import { SummaryInfoListsProps } from './interfaces/index';

const SummaryInfoLists = ({ summaryItems }: SummaryInfoListsProps) => {
  return (
    <Card className='p-0 m-0  border-0 gap-4'>
      {summaryItems.map((item, index) => (
        <SummaryInfo
          key={index}
          icon={item.icon}
          name={item.name}
          number={item.number}
        />
      ))}
    </Card>
  );
};

export default React.memo(SummaryInfoLists);
