'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { memo } from 'react';
import { TrademarkCardProps } from '../interface/interface';

const TrademarkCard = ({
  title = 'Trademark Registration',
  status = 'Completed',
  price,
  badge,
  className
}: TrademarkCardProps) => {
  return (
    <Card
      className={cn(
        'relative w-full border border-[#4FC3F7] bg-blue-50 rounded-lg shadow-sm',
        className
      )}>
      {/* Badge */}
      {badge && (
        <Badge
          variant={badge.variant || 'destructive'}
          className={cn(
            'absolute sm:top-0 sm:right-4 top-0 right-0 rounded -tl-none rounded-br-none rounded-tr-lg rounded-bl-md  sm:rounded-b-md sm:rounded-t-none text-md px-3 py-0 w-[60px] text-center justify-center flex',
            badge.variant === 'destructive'
              ? 'bg-[#FF383C] text-white'
              : badge.variant === 'default'
                ? 'bg-[#34C759] text-white'
                : ''
          )}>
          {badge.text}
        </Badge>
      )}

      <CardContent className='p-0 sm:p-4'>
        <div
          className='
            flex flex-col-reverse sm:flex-row
            items-start sm:items-end 
            justify-between gap-3
          '>
          {/* Title + Status */}
          <div className='flex flex-col leading-tight'>
            <CardTitle className='text-sm md:text-md font-semibold text-[#0A2342] sm:text-base'>
              {title}
            </CardTitle>
            <p className='text-xs  md:text-sm mt-4 sm:mt-0 text-[#3F9CC6] sm:text-gray-900'>
              {status}
            </p>
          </div>

          {/* PRICE — Mobile TOP, Desktop RIGHT */}
          <div className='text-left text-[#0A2342] sm:text-right mb-2 sm:mb-0'>
            <div className='text-xl sm:text-4xl font-bold text-[#0A2342]'>₹{price}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(TrademarkCard);
