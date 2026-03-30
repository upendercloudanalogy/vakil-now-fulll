import React from 'react';
import { Card } from '@/components/ui/card';
import { ChevronLeft, LogOut } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface SidebarMenuCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: number | string;
  marginTop?: string | number;
  marginBottom?: string | number;
  padding?: string | number;
  bgColor?: string;
  textColor?: string;
  name?: string;
  iconWidth?: number;
  iconHeight?: number;
  iconOpacity?: number;
  fontSize?: string | number;
  image?: string;
  fontweight?: number;
  leftIcon?: boolean;
  logoutIcon?: boolean;
  href: string;
}

export const SidebarMenuCard = React.forwardRef<
  HTMLDivElement,
  SidebarMenuCardProps
>(
  (
    {
      gap = 3,
      marginTop = '10px',
      marginBottom = '10px',
      padding = '10px',
      bgColor = 'rgba(88, 167, 72, 1)',
      textColor = 'rgb(177,179,181)',
      name = 'Default',
      iconWidth = 24,
      iconHeight = 24,
      iconOpacity = 1,
      fontSize = 'Medium',
      image,
      fontweight,
      leftIcon,
      logoutIcon,
      className,
      href,
      ...props // 👈 this spreads onClick, data-state, etc.
    },
    ref
  ) => {
    return (
      <Card
        ref={ref} // 👈 forward the ref
        className={cn(
          'flex flex-row w-full border-none rounded-[5px] shadow-none transition-colors duration-200',
          className
        )}
        style={{
          padding,
          marginTop,
          marginBottom,
          backgroundColor: bgColor,
          gap: typeof gap === 'number' ? `${gap * 4}px` : gap
        }}
        {...props} // 👈 spread all event handlers & attributes
      >
        <div
          className='flex items-center justify-center group-data-[state=open]:rotate-270'
          style={{
            width: typeof iconWidth === 'number' ? `${iconWidth}px` : iconWidth,
            height:
              typeof iconHeight === 'number' ? `${iconHeight}px` : iconHeight,
            opacity: iconOpacity
          }}>
          {image ? (
            <Image
              src={image} // don’t forget the src
              width={iconWidth}
              height={iconHeight}
              alt='icon'
              className='object-contain rounded-full flex shrink-0'
            />
          ) : leftIcon ? (
            <ChevronLeft style={{ color: textColor }} />
          ) : logoutIcon ? (
            <LogOut
              width={iconWidth}
              height={iconHeight}
              className='text-white'
            />
          ) : null}

          {/* <ChevronLeft className={`text-[${textColor}]`} /> */}
        </div>
        <div
          className='flex items-center font-inter font-medium text-[14px] leading-[20px] tracking-[0]'
          style={{
            color: textColor,
            fontSize: fontSize,
            fontWeight: fontweight
          }}>
          <Link href={href} className='hover:underline'>
            {name}
          </Link>
        </div>
      </Card>
    );
  }
);

SidebarMenuCard.displayName = 'SidebarMenuCard';
