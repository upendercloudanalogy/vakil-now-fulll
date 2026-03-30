interface WeekCalendarProps {
  className?: string;
  scale?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  onDateSelect?: (date: Date) => void;
}
