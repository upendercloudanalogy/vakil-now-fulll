import React from 'react';
export interface SummaryItem {
  icon: React.ReactNode;
  name: string;
  number: number;
}

export interface SummaryInfoListsProps {
  summaryItems: SummaryItem[];
}
