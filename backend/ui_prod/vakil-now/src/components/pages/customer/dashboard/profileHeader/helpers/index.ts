'Today 15th December 2025';

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();

  if (isToday) {
    return `Today, ${day} ${month} ${year}`;
  }

  return `${day} ${month} ${year}`;
}
