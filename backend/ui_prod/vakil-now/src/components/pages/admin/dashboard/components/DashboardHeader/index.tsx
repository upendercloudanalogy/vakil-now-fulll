'use client';
import { Card } from '@/components/ui/card';
import SectionHeadingWithLink from '../SectionHeading/index';
import { SearchBar } from '@/components/common/searchBarAdmin';
import { Icons } from '../../../../../../lib/icons/index';
import React from 'react';

const DashboardHeaderComponent = () => {
  return (
    <Card className='pb-0 px-4 md:px-8  flex-col-reverse md:flex-row md:items-center justify-between border-0 gap-2'>
      <SectionHeadingWithLink
        title='Dashboard'
        className='md:text-[rgb(89,89,89)] font-inter font-bold  text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl'
      />
      <Card className='p-0 m-0 flex-row border-0  h-full justify-between gap-2 md:gap-3'>
        <SearchBar
          backgroundColor='rgba(237,249,254,1)'
          border='none'
          placeholderColor='rgba(79, 195, 247, 1)'
          wrapperClassName='
            w-[160px]
            sm:w-[220px]
            md:w-[300px]
            lg:w-[380px]
            xl:w-[522px]
            flex-1 '
          classNameOfInputbar='
            font-inter font-medium
            text-[16px] sm:text-[18px] md:text-[20px] '
          clasNameOfIcon='w-[20px] h-[20px]'
          iconColor='rgba(63, 156, 198, 1)'
        />
        <Card className='border-0 flex-row p-0 m-0 justify-between gap-2 h-full'>
          <Card className='bg-[rgb(21,101,192)] w-[40px] md:w-[48px] rounded-[4px] p-0 m-0 justify-center items-center border-0'>
            <Icons.FilterIcon height={20} width={20} />
          </Card>
          <Card className='bg-[rgb(21,101,192)] w-[40px] md:w-[48px] rounded-[4px] p-0 m-0 justify-center items-center border-0 shadow-none'>
            <Icons.NotificationIcon height={20} width={20} />
          </Card>
        </Card>
      </Card>
    </Card>
  );
};

export default React.memo(DashboardHeaderComponent);
