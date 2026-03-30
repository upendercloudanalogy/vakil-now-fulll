import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { InputHTMLAttributes, ReactNode } from 'react';

interface InputWithLabelProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder: string;
  className?: string;
  error?: string;
  rightIcon?: ReactNode;
  labelClassName?: string; 
}

export default function InputWithLabel ({
  type = 'text',
  label,
  placeholder,
  className,
  error,
  rightIcon,
  labelClassName,
  ...props
}: InputWithLabelProps) {
  return (
    <div className="flex flex-col gap-1 md:gap-0">

      {/* ✅ Label slot ALWAYS rendered */}
      <div className={cn(
        label ? "min-h-[22px]" : "min-h-0"
      )}>

        {label && (
          <label className={cn("text-base font-medium text-[#737373]",labelClassName)}>
            {label}
          </label>
        )}
      </div>

      {/* Input wrapper */}
      <div className="relative">
        <Input
          type={type}
          placeholder={placeholder}
          aria-invalid={props['aria-invalid']} 
          className={cn(
            'border rounded-[4px] !font-inter !font-normal !text-[16.49px] !leading-[24.74px]',
            rightIcon && 'pr-10',
            error
              ? 'border-red-500 focus-visible:ring-red-500'
              : 'border-[#4FC3F7]',
            className
          )}
          {...props}
        />

        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B8B8B8] text-2xl">
            {rightIcon}
          </span>
        )}
      </div>

      {/* ✅ Error/helper slot ALWAYS reserved */}
      <div className={cn(
        error ? "min-h-[18px]" : "min-h-0"
      )}>

        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}
      </div>

    </div>
  );
}
