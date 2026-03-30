'use client';
import DashboardCard from '@/components/common/dashboardCard/index';
import React from 'react';
import { DashboardCardListsProps } from './interfaces/index';

const DashboardCardLists = ({ dashboardCards }: DashboardCardListsProps) => {
  return (
    <div className='p-0 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 md:px-8'>
      {dashboardCards.map((item, index) => (
        <DashboardCard
          key={index}
          title={item.title}
          value={item.value}
          icon={item.icon}
          linkHref={item.href}
          className='rounded-[4px] border p-3 sm:p-4 md:p-5 w-full shadow-none border-[rgb(101,202,248)]'
        />
      ))}
    </div>
  );
};

export default React.memo(DashboardCardLists);
