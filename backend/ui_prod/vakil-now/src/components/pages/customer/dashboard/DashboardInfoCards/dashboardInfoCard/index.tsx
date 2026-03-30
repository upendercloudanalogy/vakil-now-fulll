'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Plus, Wallet } from 'lucide-react';
import Link from 'next/link';
import { memo } from 'react';
import { DashboardInfoCardProps } from '../interfaces/interface';

interface ExtendedDashboardInfoCardProps extends DashboardInfoCardProps {
  circleBgColor?: string; // Hex color or Tailwind class for circle background
  iconBgColor?: string;   // Hex color or Tailwind class for square background
  href?: string;
}

const DashboardInfoCard = ({
  title = 'Wallet Balance',
  subText,
  amount,
  currency,
  href = "#",
  mainIcon = <Wallet className="w-6 h-6 text-white" />,
  rightIcon = <Plus className="w-5 h-5 text-blue-700" />,
  className,
  iconSize = 'w-20 h-20',
  iconBgColor = 'bg-[#56C8FF]', // Default square color
  circleBgColor = '#f0f0f0' // Default circle color
}: ExtendedDashboardInfoCardProps) => {
  const showAddIcon = rightIcon !== undefined;
  const hasAmount = amount !== undefined && currency !== undefined;

  return (
    <Card
      className={cn(
        'w-full rounded-lg shadow-sm py-0 sm:py-4 sm:px-2 overflow-hidden',
        className
      )}>
      <CardContent className='py-0 px-4 h-full flex flex-col sm:flex-row items-center sm:p-3 sm:py-3'>
        {/* TOP SECTION - MAIN ICON (Mobile) */}
        <div className='flex sm:hidden items-center justify-center w-full py-3'>
          <div
            className={cn(
              'rounded-full flex items-center justify-center shrink-0 relative',
              'w-16 h-16',

              !circleBgColor.startsWith('#') && circleBgColor // Tailwind class
            )}
            style={circleBgColor.startsWith('#')
              ? { backgroundColor: circleBgColor }
              : undefined
            }
          >
            {/* Square inside the circle - positioned extreme bottom-right */}
            <div
              className={cn(
                'absolute flex items-center justify-center',
                'w-9 h-9', // Smaller square to fit in corner
                'rounded-md',
                iconBgColor,
                'bottom-0.5 right-0.5' // Extreme bottom-right corner
              )}>
              {/* Icon positioned CENTER of square */}
              <div className='flex items-center justify-center w-full h-full'>
                {mainIcon}
              </div>
            </div>
          </div>
        </div>

        {/* LEFT SECTION (Desktop) */}
        <div className='hidden sm:flex items-center gap-3 flex-1 md:flex-col md:items-start md:gap-1'>
          {/* MAIN ICON WITH CIRCLE AND SQUARE INSIDE */}
          <div
            className={cn(
              'rounded-full flex items-center justify-center shrink-0 relative',
              iconSize,
              'md:self-start',

              !circleBgColor.startsWith('#') && circleBgColor // Tailwind class
            )}
            style={circleBgColor.startsWith('#')
              ? { backgroundColor: circleBgColor }
              : undefined
            }
          >
            {/* Square inside the circle - positioned extreme bottom-right */}
            <div
              className={cn(
                'absolute flex items-center justify-center',
                'w-13 h-13', // Fixed: Changed from 'w-12 h-15' to 'w-12 h-12' for square
                'rounded-md',
                iconBgColor,
                'bottom-0 top-8 right-0' // Fixed: Changed from 'bottom-[-10]' to 'bottom-1'
              )}>
              {/* Icon positioned CENTER of square */}
              <div className='flex items-center justify-center w-full h-full'>
                {mainIcon}
              </div>
            </div>
          </div>

          {/* TEXT SECTION */}
          <div className='flex flex-col md:mt-1 min-h-[60px] md:min-h-[70px]'>
            <h3 className='text-[13px] font-bold text-[#0A2342] md:text-2xl'>
              {title}
            </h3>

            {subText && <p className='text-sm mt-1 text-gray-600'>{subText}</p>}

            {hasAmount ? (
              <p className='text-md font-bold text-blue-900 md:text-base mt-1'>
                {amount} {currency}
              </p>
            ) : (
              <div className='mt-1 h-6'></div>
            )}
          </div>
        </div>

        {/* CENTER SECTION - TEXT (Mobile) - Only title with smaller text */}
        <div className='flex sm:hidden flex-col items-center text-center w-full py-2'>
          <h3 className='text-sm font-bold text-blue-900'>{title}</h3>
        </div>

        {/* RIGHT ICON (NOT BUTTON) */}
        {showAddIcon && (
          <Link
            href={href}
            className="cursor-pointer shrink-0 flex items-center justify-center absolute top-2 right-4 sm:static"
          >
            {rightIcon}
          </Link>
        )}
      </CardContent>
    </Card>
  );
};

export default memo(DashboardInfoCard);
