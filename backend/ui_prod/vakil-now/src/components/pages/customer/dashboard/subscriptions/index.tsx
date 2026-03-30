'use client';

import { CustomLink } from '@/components/common/customLink';
import { SectionHeading } from '@/components/common/sectionHeading';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { SubscriptionsProps } from './interface/interface';
import TrademarkCard from './subscriptionCard';

export function Subscriptions ({
  className,
  subscriptions
}: SubscriptionsProps) {
  return (
    <div className={cn('bg-white rounded-lg ', className)}>
      {/* Header - Made fully consistent */}
      <div className='flex justify-between items-baseline mb-6'>
        <SectionHeading
          title='Subscriptions'
          fontWeight='font-bold'
          color='text-blue-900'
          padding='p-0'
          margin='m-0'
          font='sans'
          className='tracking-tight sm:text-2xl text-[#0A2342] text-lg'
        />

        <CustomLink
          text='View All'
          href={ROUTES.customer.dashboard.subscriptions}
          className='h-9 w-28 text-sm text-blue-600 bg-[#EDF9FE] border-none'
        />
      </div>

      {/* Cards */}
      <div className='flex flex-row flex-wrap gap-3 lg:flex-col lg:gap-4'>
        {subscriptions.map((sub, index) => (
          <div key={index} className='w-[calc(50%-6px)] lg:w-full'>
            <TrademarkCard
              title={sub.title}
              status={sub.status}
              price={sub.price}
              badge={sub.badge}
              className='bg-[#EDF9FE] p-3 lg:p-4'
            />
          </div>
        ))}
      </div>
    </div>
  );
}
