import { LucideIcon } from 'lucide-react';

export interface DashboardCardItem {
  title: string;
  value: number | string;
  icon: LucideIcon;
  href?: string;
}

export interface DashboardCardListsProps {
  dashboardCards: DashboardCardItem[];
}
