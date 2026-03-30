'use client';
import React from 'react';
import { QuickAction } from './interfaces/index';
import { Button } from '@/components/ui/button';

const QuickActionsItem = ({ icon, name }: QuickAction) => {
  return (
    <Button className='bg-transparent hover:bg-transparent shadcn-button '>
      {icon}
      {name}
    </Button>
  );
};

export default React.memo(QuickActionsItem);
