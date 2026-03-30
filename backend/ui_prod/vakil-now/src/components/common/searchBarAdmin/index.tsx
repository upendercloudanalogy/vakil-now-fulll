'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (e: React.FormEvent) => void;
  color?: string; // e.g., "blue" for Tailwind classes like border-blue-500
  className?: string;
  width?: string; // e.g., "w-full" or "300px"
  height?: string; // e.g., "h-10" or "40px"
  backgroundColor?: string; // e.g., "#f0f9ff" or "bg-blue-50" (Tailwind class applied via className)
  border?: string; // e.g., "border-2 border-blue-500" (Tailwind classes) or "1px solid #3b82f6"
  borderRadius?: string; // e.g., "rounded-lg" or "8px"
  placeholderColor?: string;
  focusColor?: string;
  iconColor?: string;
  classNameOfInputbar?: string;
  clasNameOfIcon?: string;
  wrapperClassName?: string;
}

export function SearchBar({
  placeholder = 'Search',
  value,
  onChange,
  onSubmit,
  color = 'blue',
  className = '',
  classNameOfInputbar = '',
  clasNameOfIcon = '',
  width,
  height,
  backgroundColor,
  placeholderColor = 'rgba(153, 137, 48, 1)',
  focusColor,
  border,
  borderRadius,
  iconColor,
  wrapperClassName
}: SearchBarProps) {
  // Compute style object once to avoid  duplication
  const inputStyle: React.CSSProperties = {};
  if (
    typeof backgroundColor === 'string' &&
    !backgroundColor.startsWith('bg-')
  ) {
    inputStyle.backgroundColor = backgroundColor;
  }
  if (typeof border === 'string' && !border.includes('border-')) {
    inputStyle.border = border;
  }
  if (typeof borderRadius === 'string' && !borderRadius.includes('rounded-')) {
    inputStyle.borderRadius = borderRadius;
  }

  // Compute className dynamically
  let inputClassName = `pr-10 placeholder:text-[${placeholderColor}] focus:ring-${focusColor} h-full`;
  if (
    typeof backgroundColor === 'string' &&
    backgroundColor.startsWith('bg-')
  ) {
    inputClassName += ` ${backgroundColor}`;
  }
  if (typeof border === 'string' && border.includes('border-')) {
    inputClassName += ` ${border}`;
  }
  if (typeof borderRadius === 'string' && borderRadius.includes('rounded-')) {
    inputClassName += ` ${borderRadius}`;
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn(`relative`, wrapperClassName, className)}
      style={{ width, height }}>
      <Input
        type='search'
        placeholder={placeholder}
        value={value}
        defaultValue=''
        onChange={onChange}
        className={cn(
          `placeholder-dynamic ${inputClassName}`,
          classNameOfInputbar
        )}
        style={
          {
            ...inputStyle,
            '--placeholder-color': placeholderColor
          } as React.CSSProperties
        }
      />
      <Search
        className={cn(
          `absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4  pointer-events-none flex-shrink-0`,
          clasNameOfIcon
        )}
        style={{ color: iconColor }}
      />
    </form>
  );
}
