'use client';
import { Card } from '@/components/ui/card';
import SupportComplaintsInfo from './SupportComplaintsInfo';
import React from 'react';
import { SupportAndConsultationsListsProps } from './interfaces/index';

const SupportAndConsultaionsLists = ({
  supportItems
}: SupportAndConsultationsListsProps) => {
  return (
    <Card className='p-0 m-0 border-0 gap-4'>
      {supportItems.map((item, index) => (
        <SupportComplaintsInfo
          key={index}
          icon={item.icon}
          name={item.name}
          number={item.number}
        />
      ))}
    </Card>
  );
};

export default React.memo(SupportAndConsultaionsLists);
