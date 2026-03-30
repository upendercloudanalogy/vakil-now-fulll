'use client';

import { cn } from '@/lib/utils';

interface SectionHeadingProps {
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
}

export function SectionHeading({
  title,
  className,
  fontSize,
  fontWeight,
  color = 'text-primary',
  height,
  width,
  padding, // Default padding for spacing around title
  margin, // Default margin-bottom; can be overridden
  font
}: SectionHeadingProps) {
  return (
    <h2
      className={cn(
        `${fontSize} ${fontWeight} ${color} ${height} ${width} ${padding} ${margin} flex items-center tracking-tight font-${font}`,
        className
      )}>
      {title}
    </h2>
  );
}
