import { format, addDays, getDay, differenceInDays, parseISO, isSameDay } from 'date-fns';

export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function formatDisplayDate(dateStr: string): string {
  return format(parseISO(dateStr), 'M月d日');
}

export function getWeekdayName(dayOfWeek: number): string {
  const names = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return names[dayOfWeek] ?? '';
}

export function addDaysToStr(dateStr: string, days: number): string {
  return formatDate(addDays(parseISO(dateStr), days));
}

export function getTodayStr(): string {
  return formatDate(new Date());
}

export function getDayOfWeek(dateStr: string): number {
  return getDay(parseISO(dateStr));
}

export function daysBetween(start: string, end: string): number {
  return differenceInDays(parseISO(end), parseISO(start));
}

export function isSameDayStr(a: string, b: string): boolean {
  return isSameDay(parseISO(a), parseISO(b));
}
