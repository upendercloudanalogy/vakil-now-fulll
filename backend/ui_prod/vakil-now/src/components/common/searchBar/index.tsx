'use client';

import { Input } from '@/components/ui/input';
import { Icons } from '@/lib/icons';

export function SearchBar ({
  placeholder = 'Search',
  value,
  onChange,
  onSubmit,
  className = '',
  inputClassName = '',
  iconClassName = '',
  size = 'md' // Default medium
}: SearchBarProps) {
  // Preset size classes (customize as needed)
  const sizeClasses = {
    sm: 'h-9 text-sm px-3',
    md: 'h-10 text-base px-4',
    lg: 'h-12 text-lg px-6'
  };

  return (
    <form onSubmit={onSubmit} className={`relative ${className} rounded`}>
      <Input
        type='text'
        placeholder={placeholder}
        // value={value}
        // onChange={onChange}
        // defaultValue=""
        className={`pr-10 ${sizeClasses[size]} ${inputClassName} rounded placeholder:text-[#1565C0] placeholder:font-semibold`} // Apply size + custom
      />

      {/* Search Icon - Scale with size */}
      <Icons.SearchIcon
        className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex-shrink-0  text-[#1565C0]${size === 'lg' ? 'h-5 w-5' : size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'
          } ${iconClassName}`}
      />
    </form>
  );
}
