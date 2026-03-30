'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

interface CustomDatePickerProps {
  height: string;
  width?: string;
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  fontSize?: string; // e.g., "text-sm", "text-base"
  borderRadius?: string; // e.g., "rounded-md", "rounded-lg"
  border?: string; // e.g., "border-2 border-blue-500", "border border-gray-300"
  padding?: string; // e.g., "p-2", "px-3 py-1"
  className?: string;
}

export function CustomDatePicker({
  height,
  width,
  value,
  onChange,
  placeholder = 'Pick a date',
  disabled = false,
  fontSize = 'text-sm',
  borderRadius = 'rounded-md',
  border = 'border border-border',
  padding = 'p-2',
  className
}: CustomDatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className='relative' style={{ height, width }}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className={cn(
              `w-full justify-between text-left font-normal ${fontSize} ${border} ${borderRadius} h-full ${padding}`,
              !value && 'text-muted-foreground',
              className
            )}
            disabled={disabled}>
            <div className='pl-5'>
              {value ? format(value, 'dd/MM/yyyy') : <span>{placeholder}</span>}
            </div>
            <CalendarIcon className='h-[24px] w-[24px] mr-[20px]' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            mode='single'
            selected={value}
            onSelect={(date) => {
              onChange?.(date);
              setOpen(false); // 🔥 CLOSE POPUP
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
