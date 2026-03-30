'use client';

import { cn } from '@/lib/utils';

interface PieSegment {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieSegment[];
  size?: number;
  className?: string;
  pieClassName?: string;
}

export function PieChart({
  data,
  size = 50,
  className,
  pieClassName
}: PieChartProps) {
  const total = data.reduce((sum, segment) => sum + segment.value, 0);
  const segments: { color: string; startAngle: number; endAngle: number }[] =
    [];

  let startAngle = 0;
  data.forEach((segment) => {
    const angle = (segment.value / total) * 360; // Fixed: Multiply by 360 for degrees
    const endAngle = startAngle + angle;
    segments.push({
      color: segment.color,
      startAngle,
      endAngle
    });
    startAngle = endAngle;
  });

  const gradientValue = segments
    .map((seg) => `${seg.color} ${seg.startAngle}deg ${seg.endAngle}deg`)
    .join(', ');

  return (
    <div
      className={cn(
        'relative flex flex-row-reverse  justify-between items-center',
        className
      )}>
      <div
        className={cn(
          'relative rounded-full border border-border',
          pieClassName
        )}
        style={{
          width: size,
          height: size,
          background: `conic-gradient(from 0deg at 50% 50%, ${gradientValue})`
        }}>
        <div className='mt-4 flex flex-col gap-2'></div>
        {/* Inner circle for donut effect */}
        <div
          className='absolute inset-0 rounded-full bg-background'
          style={{
            width: size * 0.6,
            height: size * 0.6,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        />
      </div>
      {/* Legend below the chart */}
      <div className='mt-4 flex flex-col gap-2'>
        {data.map((segment) => {
          const percentage = ((segment.value / total) * 100).toFixed(0);
          return (
            <div key={segment.label} className='flex items-center gap-2'>
              <div
                className='h-3 w-3 rounded'
                style={{ backgroundColor: segment.color }}
              />

              <span
                className='text-sm md:text-xl font-medium'
                style={{ color: segment.color }}>
                {segment.label}
              </span>
              <span
                className='text-sm md:text-xl font-medium'
                style={{ color: 'rgb(89,89,89)' }}>
                {percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
