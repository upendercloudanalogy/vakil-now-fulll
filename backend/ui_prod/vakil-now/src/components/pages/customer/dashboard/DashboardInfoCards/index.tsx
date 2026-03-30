'use client';
import { cards } from './constant';
import DashboardInfoCard from './dashboardInfoCard';

export function WalletOverview () {
  return (
    <div className='flex gap-4 overflow-x-auto'>
      {cards.map((card, i) => (
        <DashboardInfoCard key={i} {...card} />
      ))}
    </div>
  );
}
