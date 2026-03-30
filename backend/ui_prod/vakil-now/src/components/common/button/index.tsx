'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface CustomButtonProps {
  text: string;
  icon?: ReactNode; // Optional icon (e.g., <Phone className="w-4 h-4" />)
  onClick?: () => void;
  variant?:
    | 'default'
    | 'outline'
    | 'ghost'
    | 'secondary'
    | 'destructive'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  // Existing customizable style props
  fontSize?: string; // e.g., 'text-sm', 'text-base' (overrides default 'text-sm')
  padding?: string; // e.g., 'px-6 py-3' (overrides default 'px-4 py-2')
  margin?: string; // e.g., 'mx-2 my-1' (adds margin around the button)
  border?: string; // e.g., 'border', 'border-2' (adds border width/style)
  borderColor?: string; // e.g., 'border-gray-300', 'border-blue-500' (sets border color)
  // New customizable style props
  borderRadius?: string; // e.g., 'rounded-md', 'rounded-full' (overrides default 'rounded-md')
  textColor?: string; // e.g., 'text-white', 'text-black' (overrides default 'text-white')
  height?: string; // e.g., 'h-10', 'h-12' (sets explicit height)
  width?: string; // e.g., 'w-full', 'w-32' (sets explicit width)
  className?: string;
}

export function CustomButton({
  text = 'Talk To Lawyer',
  icon,
  onClick,
  variant = 'default',
  size = 'default',
  fontSize,
  padding,
  margin,
  border,
  borderColor,
  borderRadius,
  textColor,
  height,
  width,
  className
}: CustomButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      className={cn(
        // Base styles (background, hover, etc.)
        "font-medium shadow-lg bg-[#1565C0] hover:bg-[#1565C0]/90 text-white rounded",
        // Customizable styles with fallbacks to originals
        fontSize || "text-sm",
        padding || "px-4 py-2",
        margin || "",
        border || "",
        borderColor || "",
        borderRadius || "",
        height || "",
        width || ""
      ,className)}
    >
      {icon && <span className="gap-2">{icon}</span>}
      {text}
    </Button>
  );
}
