'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CustomProfileAvatarProps {
  height?: string;
  width?: string;
  src?: string;
  name: string;
  title: string;
  fallbackInitial?: string;
  fontSize?: string;
  borderRadius?: string;
  border?: string;
}

export function CustomProfileAvatar({
  height,
  width,
  src,
  name,
  title,
  fallbackInitial = 'RB',
  fontSize = 'text-sm',
  borderRadius = 'rounded-md',
  border = 'border border-border'
}: CustomProfileAvatarProps) {
  return (
    <div
      className={`flex items-center space-x-4 ${border} ${borderRadius} p-4`}
      style={{ height, width }}>
      <Avatar className='h-12 w-12'>
        <AvatarImage src={src} />
        <AvatarFallback>{fallbackInitial}</AvatarFallback>
      </Avatar>

      <div className='space-y-1'>
        <p className={`font-medium leading-none ${fontSize}`}>{name}</p>
        <p className={`${fontSize} text-muted-foreground`}>{title}</p>
      </div>
    </div>
  );
}
