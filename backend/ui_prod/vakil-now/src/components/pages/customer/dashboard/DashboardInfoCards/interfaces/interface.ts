import { ReactNode } from 'react';

export interface DashboardInfoCardProps {
  title?: string;
  subText?: string; // 🔥 NEW OPTIONAL LINE
  amount?: string | number;
  currency?: string;
  onAddClick?: () => void;
  mainIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  iconSize?: string;
  iconBgColor?: string;
}
