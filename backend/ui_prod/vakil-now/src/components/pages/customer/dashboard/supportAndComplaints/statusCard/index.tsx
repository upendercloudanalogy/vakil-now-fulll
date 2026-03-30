'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Icons } from '@/lib/icons';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';
import { memo } from 'react';
import { TicketStatusCardProps } from '../interfaces';

const getVariantStyles = (variant: TicketStatusCardProps['variant']) => {
  switch (variant) {
    case 'pending':
      return {
        cardBg: 'bg-card',
        textColor: 'text-gray-900',
        icon: <Icons.CheckIcon bgColor='#FF8D28' color='white' size={28} className='border-2 border-white' />
      };
    case 'resolved':
      return {
        cardBg: 'bg-card',
        textColor: 'text-gray-900',
        icon: <Icons.CheckIcon bgColor='#43A047' color='white' size={28} />
      };
    case 'inProgress':
      return {
        cardBg: 'bg-card',
        textColor: 'text-gray-900',
        icon: <Icons.CheckIcon bgColor='#C9A33F' color='white' size={28} />
      };
    case 'new':
      return {
        cardBg: 'bg-blue-500',
        textColor: 'text-white',
        icon: <Icons.BlueAddIcon size={28} />
      };
    default:
      return {
        cardBg: 'bg-card',
        textColor: 'text-gray-900',
        icon: <Clock size={28} />
      };
  }
};

const TicketStatusCard = ({
  variant,
  label,
  count,
  className
}: TicketStatusCardProps) => {
  const styles = getVariantStyles(variant);

  return (
    <Card
      className={cn(
        'w-full shadow-sm p-0 md:p-4 border-0 border border-[#4FC3F7]',
        styles.cardBg,
        className
      )}>
      <CardContent
        className={cn(
          'flex items-center   md:p-4 p-2 md:p-0',
          variant === 'new' ? 'justify-center' : 'justify-between',
          styles.textColor
        )}>
        {/* First div: Icon + Label - with flexible width */}
        <div
          className={cn(
            'flex items-center min-w-0 gap-2',
            variant === 'new'
              ? 'justify-center mx-auto'
              : 'flex-1'
          )}
        >
          {/* Icon - smaller on mobile */}
          <div className='w-8 h-8 md:w-10 md:h-10 flex items-center justify-center flex-shrink-0 mr-2'>
            {styles.icon}
          </div>

          {/* Label - smaller text on mobile, allows wrapping */}
          {/* <p className='font-semibold text-sm md:text-md text-left text-[#0A2342] flex-1 min-w-0'> */}
          <p
            className={cn(
              'font-semibold text-sm md:text-base text-left flex-1 min-w-0  ',
              variant === 'new' ? 'text-white' : 'text-[#0A2342]'
            )}
          >
            {label}
          </p>
        </div>

        {/* Second div: Count/Number */}
        {count !== undefined && (
          <div className='text-md text-[#0A2342] font-semibold text-right ml-2 flex-shrink-0'>
            {count}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default memo(TicketStatusCard);
