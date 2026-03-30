'use client';

import { Card } from '@/components/ui/card';
import LawyerRequestItem from './LawyerRequestItem';
import React from 'react';
import { LawyerRequestListProps } from './interfaces/index';

const LawyerRequestLists = ({ lawyerRequests }: LawyerRequestListProps) => {
  return (
    <Card className='p-0 m-0 border-0 gap-3'>
      {lawyerRequests.map((req) => (
        <LawyerRequestItem key={req.id} {...req} />
      ))}
    </Card>
  );
};

export default React.memo(LawyerRequestLists);
