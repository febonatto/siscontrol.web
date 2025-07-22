import { DateISO } from '@/types';

export function toDate(dateISO: DateISO): Date {
  const [date] = dateISO.split('T');
  const [year, month, day] = date.split('-').map(Number);

  return new Date(year, month - 1, day);
}
