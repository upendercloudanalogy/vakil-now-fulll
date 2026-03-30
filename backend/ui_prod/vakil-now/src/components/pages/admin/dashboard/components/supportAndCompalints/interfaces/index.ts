export interface SupportItem {
  icon: React.ReactNode;
  name: string;
  number: number;
}

export interface SupportAndConsultationsListsProps {
  supportItems: SupportItem[];
}
