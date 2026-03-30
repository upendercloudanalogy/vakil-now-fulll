'use client';

import { CustomLink } from '@/components/common/customLink';
import StepProgressBar from '@/components/common/progressBar';
import { SectionHeading } from '@/components/common/sectionHeading';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { TrackServicesProps } from './interfaces';

export function TrackServices ({ className, services }: TrackServicesProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-lg p-0 sm:p-6 sm:border border-gray-200',
        className
      )}>
      {/* Header - Made fully consistent */}
      <div className='flex justify-between items-baseline mb-6'>
        <SectionHeading
          title='Track Services'
          className='text-2xl font-bold text-[#0A2342] tracking-tight p-0 m-0 font-sans sm:text-2xl text-lg'
        />

        <CustomLink
          text="View All"
          href={ROUTES.customer.dashboard.sidebar.services}
          className="h-9 w-28 text-sm text-[#1565C0] sm:bg-[#EDF9FE] border-none"
        />
      </div>

      {/* List */}
      <div className='flex flex-col space-y-4 flex-1'>
        {services.map((item, index) => (
          <div
            key={index}
            className={index === 0 ? 'block sm:block' : 'hidden sm:block'}>
            <StepProgressBar
              date={item.date}
              title={item.title}
              currentStep={item.currentStep}
              totalSteps={item.totalSteps}
              activeColor={item.activeColor}
              pendingColor={item.pendingColor}
              className='border-[#4FC3F7] bg-[#EDF9FE]'
            />
          </div>
        ))}
      </div>
    </div>
  );
}
