export interface SupportComplaintsProps {
  className?: string;
  tickets?: {
    variant: 'pending' | 'resolved' | 'inProgress' | 'new';
    label: string;
    count?: number;
  }[];
}

export interface TicketStatusCardProps {
  variant: 'pending' | 'resolved' | 'inProgress' | 'new';
  label: string;
  count?: number;
  className?: string;
}
