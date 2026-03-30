'use client';
import { CustomLink } from '@/components/common/customLink';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import React from 'react';

export interface SectionHeadingWithLinkProps {
  title: string;
  className?: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  height?: string;
  width?: string;
  padding?: string;
  margin?: string;
  font?: string;
  linkName?: string;
  href?: string;
}

const SectionHeadingWithLink = ({
  title,
  className,
  fontSize,
  fontWeight,
  color = 'text-primary',
  height,
  width,
  padding, // Default padding for spacing around title
  margin, // Default margin-bottom; can be overridden
  font,
  linkName,
  href = '#'
}: SectionHeadingWithLinkProps) => {
  return (
    <Card
      className={cn(
        'flex-row justify-between p-0 m-0 border-0 gap-8',
        className
      )}>
      <h2
        className={cn(
          `${fontSize} ${fontWeight} ${color} ${height} ${width} ${padding} ${margin} flex items-center tracking-tight font-${font}`,
          'h-full font-inter font-semibold  md:font-bold text-lg sm:text-lg  md:text-xl lg:text-2xl xl:text-3xl ',
          className
        )}>
        {title}
      </h2>
      {linkName && (
        <CustomLink
          text={linkName}
          className='font-inter font-medium p-0 m-0 h-full  w-full text-sm md:text-base hover:underline  md:whitespace-nowrap flex-shrink-0'
          href={href}
        />
      )}
    </Card>
  );
};

export default React.memo(SectionHeadingWithLink);
