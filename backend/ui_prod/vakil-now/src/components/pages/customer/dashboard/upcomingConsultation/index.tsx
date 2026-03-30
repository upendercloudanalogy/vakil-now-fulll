'use client';

import { CustomLink } from '@/components/common/customLink';
import { SectionHeading } from '@/components/common/sectionHeading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { useMemo, useState } from 'react';
import { WeekCalendar } from '../../../../common/scrollCalendor';
import { UpcomingConsultationProps } from './interfaces';

export function UpcomingConsultation ({
  className,
  consultations
}: UpcomingConsultationProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Memoized parsing of all consultation dates
  const parsedConsultations = useMemo(() => {
    return consultations.map((c) => {
      const [datePart, timePart] = c.date.split(' '); // "22/10/2025" "11:00 AM"
      const [dd, mm, yyyy] = datePart.split('/').map(Number);
      const [hours, minutes] = timePart ? timePart.split(':') : [0, 0];
      let hourNum = Number(hours);
      const minuteNum = Number(minutes);

      if (timePart?.includes('PM') && hourNum < 12) hourNum += 12;
      if (timePart?.includes('AM') && hourNum === 12) hourNum = 0;

      return {
        ...c,
        parsedDate: new Date(yyyy, mm - 1, dd, hourNum, minuteNum)
      };
    });
  }, [consultations]);

  // Memoized next consultation based on selectedDate
  const nextConsultation = useMemo(() => {
    if (!parsedConsultations.length) return null;

    if (selectedDate) {
      return parsedConsultations.find(
        (c) => c.parsedDate.toDateString() === selectedDate.toDateString()
      );
    }

    return parsedConsultations[0];
  }, [parsedConsultations, selectedDate]);

  return (
    <div
      className={cn(
        'flex flex-col bg-white rounded-lg p-0 sm:p-6 sm:border border-gray-200 overflow-x-hidden',
        className
      )}>
      {/* Header - Fixed with perfect vertical alignment */}
      <div className='flex justify-between items-baseline mb-6'>
        <SectionHeading
          title='Upcoming Consultation'
          fontWeight='font-bold'
          color='text-blue-900'
          padding='p-0'
          margin='m-0'
          font='sans'
          className='tracking-tight text-[#0A2342] sm:text-2xl text-lg'
        />

        <CustomLink
          text='View All'
          href={ROUTES.customer.dashboard.consultations}
          className='h-9 w-28 text-sm text-[#1565C0] sm:bg-[#EDF9FE] border-none'
        />
      </div>

      {/* Calendar Container */}
      <div className='bg-[#EDF9FE] px-3 py-4 sm:px-0 sm:py-3 rounded-lg border border-[#4FC3F7] sm:border-none flex-1'>
        <div className='flex-1 min-h-0 mb-4'>
          <WeekCalendar
            consultations={consultations}
            // className="w-full h-full bg-[#EDF9FE]"
            onDateSelect={(date) => setSelectedDate(date)}
          />
        </div>

        {/* Selected Consultation */}
        {nextConsultation && (
          <div className='w-full flex justify-center mt-2 cursor-pointer'>
            <div
              className='
              bg-[#C8ECFD]
              flex items-center gap-3
              p-3 rounded-xl
              border border-blue-200
              w-full max-w-[260px]
              '>
              <Avatar className='w-10 h-10 shrink-0'>
                {nextConsultation.avatarUrl ? (
                  <AvatarImage
                    src={nextConsultation.avatarUrl}
                    alt={nextConsultation.name}
                  />
                ) : (
                  <AvatarFallback className='bg-purple-500 text-white'>
                    {nextConsultation.initials ||
                      nextConsultation.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className='leading-tight w-full'>
                <h4 className='font-semibold text-blue-900 text-sm truncate'>
                  {nextConsultation.name}
                </h4>
                <p className='text-xs text-blue-600 mt-0.5'>
                  Next: {nextConsultation.date}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
