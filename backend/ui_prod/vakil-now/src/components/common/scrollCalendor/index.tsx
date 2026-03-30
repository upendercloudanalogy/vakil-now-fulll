'use client';

import { Consultation } from '@/components/pages/customer/dashboard/upcomingConsultation/interfaces';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  getDateOnly,
  getWeekDays,
  goNextWeek,
  goPrevWeek,
  isPastDate,
  isSameDate,
  updateMonth,
  updateYear
} from './helpers/index';

export function WeekCalendar ({
  onDateSelect,
  consultations = []
}: {
  onDateSelect?: (d: Date) => void;
  consultations?: Consultation[];
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekReferenceDate, setWeekReferenceDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'year'>('month');
  const [open, setOpen] = useState(false);

  const weekDays = getWeekDays(weekReferenceDate);
  const weekdayShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const monthLabel = weekReferenceDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric'
  });

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];
  const currentYear = weekReferenceDate.getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  // Set default selection = today
  useEffect(() => {
    const today = new Date();
    setSelectedDate(today);
    setWeekReferenceDate(today);
    onDateSelect?.(today);
  }, []);

  const todaysConsultations = consultations.filter(
    (c) => getDateOnly(c.date).toDateString() === selectedDate.toDateString()
  );

  return (
    <>
      <Card className='w-full max-w-full bg-[#EDF9FE] border-0 shadow-none px-0 sm:px-4 overflow-x-hidden'>
        {/* HEADER */}
        <div className='flex justify-between items-center mb-4'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setWeekReferenceDate(goPrevWeek(weekReferenceDate))}>
            <ChevronLeft className='w-5 h-5 sm:w-6 sm:h-6 hover:bg-[#EDF9FE] text-[#1565C0]' />
          </Button>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <p className='font-semibold text-[#1565C0] text-base sm:text-lg cursor-pointer select-none'>
                {monthLabel}
              </p>
            </PopoverTrigger>

            <PopoverContent className='w-64 p-4'>
              {view === 'month' && (
                <div>
                  <div className='grid grid-cols-3 gap-2 mb-4'>
                    {months.map((m, i) => (
                      <Button
                        key={i}
                        variant='outline'
                        onClick={() => {
                          const newD = updateMonth(selectedDate, i);
                          setSelectedDate(newD);
                          setWeekReferenceDate(newD);
                          setOpen(false);
                        }}
                        className={`py-2 text-sm sm:text-base ${i === selectedDate.getMonth()
                          ? 'bg-[#1565C0] text-white'
                          : ''
                          }`}>
                        {m}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant='ghost'
                    className='w-full text-blue-600'
                    onClick={() => setView('year')}>
                    Change Year ({currentYear})
                  </Button>
                </div>
              )}

              {view === 'year' && (
                <div>
                  <div className='grid grid-cols-3 gap-2 mb-4'>
                    {years.map((y) => (
                      <Button
                        key={y}
                        variant='outline'
                        onClick={() => {
                          const newD = updateYear(selectedDate, y);
                          setSelectedDate(newD);
                          setWeekReferenceDate(newD);
                          setView('month');
                        }}
                        className={`py-2 text-sm sm:text-base ${y === currentYear ? 'bg-[#1565C0] text-white' : ''
                          }`}>
                        {y}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant='ghost'
                    className='w-full text-blue-600'
                    onClick={() => setView('month')}>
                    Back to Months
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>

          <Button
            variant='ghost'
            size='icon'
            onClick={() => setWeekReferenceDate(goNextWeek(weekReferenceDate))}>
            <ChevronRight className='w-5 h-5 sm:w-6 sm:h-6 text-[#1565C0] hover:bg-[#EDF9FE]' />
          </Button>
        </div>

        {/* WEEK DAYS */}

        <div className='relative px-2'>
          <div className='flex gap-2 py-2 sm:gap-4 sm:justify-center overflow-x-auto max-w-full'>
            {weekDays.map((day, i) => {
              const isToday = isSameDate(day, new Date());
              const isSelected = isSameDate(day, selectedDate);
              const isPast = isPastDate(day);

              return (
                <div
                  key={i}
                  className={`
                  flex flex-col items-center justify-center gap-1 rounded px-2 min-w-[36px] sm:min-w-[50px]
                  ${isSelected
                      ? 'bg-[#1565C0] text-white'
                      : isToday
                        ? 'bg-[#90CAF9] text-white'
                        : isPast
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-[#1565C0]'
                    }
                  cursor-pointer
                `}
                  onClick={() => {
                    if (isPast) return;
                    setSelectedDate(day);
                    onDateSelect?.(day);
                  }}>
                  <span className='text-md'>{weekdayShort[i]}</span>
                  <span className='rounded-md text-md h-7 w-7 flex items-center justify-center'>
                    {day.getDate()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* CONSULTATION LIST */}
      <div className='mt-4'>
        {todaysConsultations.length === 0 && (
          <p className='text-center text-gray-500'>
            No consultations for this day.
          </p>
        )}
      </div>
    </>
  );
}
