'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Check } from 'lucide-react';
import { memo } from 'react';

const StepProgressBar = ({
  date,
  title,
  currentStep,
  totalSteps = 5,
  className
}: StepProgressBarProps) => {
  const activeColor = '#43A047'; // completed step fill
  const pendingColor = '#D9D9D9'; // upcoming step fill
  const tickColor = '#43A047'; // current tick circle

  const progressValue = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <Card
      className={`bg-[#EDF9FE] border-[#4FC3F7] md:rounded-xl rounded-md overflow-hidden py-2 ${className}`}>
      <CardContent className='flex flex-col h-full p-2'>
        {/* Header */}
        <div className='flex justify-between items-start mb-3 shrink-0'>
          <div className='space-y-1'>
            <div className='text-sm font-medium text-[#4FC3F7]'>{date}</div>
            <div className='text-sm font-semibold md:text-xl text-[#0A2342]'>{title}</div>
          </div>
          <div className='text-sm font-medium text-[#0A2342]'>Progress</div>
        </div>

        {/* Progress Bar Section */}
        <div className='relative w-full mt-4'>
          <Progress
            value={progressValue}
            className='h-2 bg-gray-200 [&>div]:bg-[#22c55e]'
          />

          {/* Step Dots */}
          <div className='absolute inset-0 flex justify-between items-center z-20'>
            {Array.from({ length: totalSteps }).map((_, index) => {
              const step = index + 1;
              const isCurrent = step === currentStep;
              const isCompleted = step < currentStep;
              const isPending = step > currentStep;

              const bg = isCurrent
                ? tickColor
                : isCompleted
                  ? activeColor
                  : pendingColor;

              const borderColor =
                isCompleted || isPending ? '#ffffff' : 'transparent'; // border only on completed & pending

              const dotSize = isCurrent ? '1.7em' : '0.75em';

              return (
                <div
                  key={index}
                  className='rounded-full flex items-center justify-center transition-all duration-300'
                  style={{
                    backgroundColor: bg,
                    width: dotSize,
                    height: dotSize,
                    border: isCurrent ? 'none' : `2px solid ${borderColor}` // ✅ no border on current step
                  }}>
                  {isCurrent && (
                    <Check
                      className='text-white'
                      size={16}
                      style={{ strokeWidth: 3 }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(StepProgressBar);
