'use client';
import { Card } from '@/components/ui/card';
import ConsultationItem from './ConsultationItem';
import React from 'react';
import { BookedConsultationsListsProps } from './interfaces/index';

const BookedConsultaionsLists = ({
  bookedConsultations
}: BookedConsultationsListsProps) => {
  return (
    <Card className='p-0 m-0 border-0 gap-1'>
      {bookedConsultations.map((item) => (
        <ConsultationItem key={item.id} {...item} />
      ))}
    </Card>
  );
};

export default React.memo(BookedConsultaionsLists);
