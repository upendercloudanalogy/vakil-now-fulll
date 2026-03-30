'use client';
import { Card } from '@/components/ui/card';
import QuickActionsItem from './QuickActionsItem';
import React from 'react';
import { QuickActionsListsProps } from './interfaces/index';

const QuickActionsLists = ({ quickActions }: QuickActionsListsProps) => {
  return (
    <Card className='p-0 m-0  border-0 shadow-none rounded-none bg-transparent flex-col justify-between  gap-4'>
      {quickActions.map((action, index) => (
        <QuickActionsItem key={index} icon={action.icon} name={action.name} />
      ))}
    </Card>
  );
};

export default React.memo(QuickActionsLists);
