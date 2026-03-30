'use client';

import { CustomLink } from '@/components/common/customLink';
import { SectionHeading } from '@/components/common/sectionHeading';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { SupportComplaintsProps } from './interfaces';
import TicketStatusCard from './statusCard';

const SupportComplaints = ({
  className,
  tickets = []
}: SupportComplaintsProps) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg p-0 sm:p-6 sm:border border-gray-200 sm:bg-[#EDF9FE]',
        className
      )}>
      {/* Header - Made fully consistent */}
      <div className='flex justify-between items-baseline mb-6'>
        <SectionHeading
          title='Support & Complaints'
          fontWeight='font-bold'
          color='text-[#0A2342]'
          padding='p-0'
          margin='m-0'
          font='sans'
          className='tracking-tight sm:text-2xl text-lg'
        />

        <CustomLink
          text='View All'
          href={ROUTES.customer.dashboard.supportComplaints}
          className='h-9 w-28 text-sm text-blue-600 sm:bg-[#EDF9FE] border-none'
        />
      </div>

      {/* Grid */}
      <div className='grid grid-cols-2 gap-4'>
        {tickets.map((ticket, idx) => (
          <TicketStatusCard
            key={idx}
            variant={ticket.variant}
            label={ticket.label}
            count={ticket.count}
            className={`rounded-lg cursor-pointer ${ticket.variant !== 'new' ? 'bg-[#EDF9FE]' : 'bg-[#1565C0] text-white'
              }`}
          />
        ))}
      </div>
    </div>
  );
};

export default SupportComplaints;
