// utils/weekCalendarUtils.ts

// Parse dd/mm/yyyy hh:mm to pure Date
export const getDateOnly = (fullDateString: string) => {
  const [day, month, yearAndTime] = fullDateString.split('/');
  const [year] = yearAndTime.split(' ');
  return new Date(`${year}-${month}-${day}`);
};

// Monday as start of week
export const startOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

// Get full week days (7 days)
export const getWeekDays = (date: Date): Date[] => {
  const start = startOfWeek(date);
  return [...Array(7)].map((_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
};

// Move week backward by 7 days
export const goPrevWeek = (date: Date) => {
  const d = new Date(date);
  d.setDate(d.getDate() - 7);
  return d;
};

// Move week forward by 7 days
export const goNextWeek = (date: Date) => {
  const d = new Date(date);
  d.setDate(d.getDate() + 7);
  return d;
};

// Update month
export const updateMonth = (current: Date, month: number) => {
  const newDate = new Date(current);
  newDate.setMonth(month);
  return newDate;
};

// Update year
export const updateYear = (current: Date, year: number) => {
  const newDate = new Date(current);
  newDate.setFullYear(year);
  return newDate;
};

// Check if two dates are same (ignoring time)
export const isSameDate = (a: Date, b: Date) => {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

// Check if date is past
export const isPastDate = (day: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const d = new Date(day);
  d.setHours(0, 0, 0, 0);

  return d < today;
};
