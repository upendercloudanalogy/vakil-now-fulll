'use client';

import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  linkHref?: string;
  linkText?: string;
  width?: string;
  height?: string;
  bgColor?: string;
  borderColor?: string;
  borderRadius?: string;
  className?: string;
}

const DashboardCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  linkHref = '#',
  linkText = 'View All',
  width = '',
  height = '',
  bgColor = 'bg-white',
  borderColor = 'border-blue-200',
  borderRadius = 'rounded-xl',
  className
}: StatsCardProps) => {
  return (
    <Card
      className={cn(
        `flex flex-col justify-between ${width} ${height} ${bgColor} ${borderColor} ${borderRadius} border shadow-sm hover:shadow-md transition-all duration-300`,
        className
      )}>
      <CardContent className='flex flex-col p-0'>
        <div className='flex flex-col-reverse md:flex-row items-start justify-between gap-1 md:gap-0'>
          <p className='font-inter font-medium text-[12px] sm:text-[14px] md:text-[14px] text-gray-500'>
            {title}
          </p>

          <Icon className='w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-gray-400' />
        </div>

        <p className='font-inter font-bold text-[32px] leading-[40px] tracking-normal'>
          {value}
        </p>
        <Link
          href={linkHref}
          className='text-xs sm:text-sm font-medium text-blue-600 hover:underline  md:ml-auto mt-1 md:mt-0'>
          {linkText}
        </Link>
      </CardContent>
    </Card>
  );
};

export default React.memo(DashboardCard);
