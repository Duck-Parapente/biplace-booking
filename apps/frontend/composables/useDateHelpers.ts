/**
 * Date formatting and manipulation helpers
 */

/**
 * Convert string or Date to Date object
 */
function toDate(date: Date | string): Date {
  return typeof date === 'string' ? new Date(date) : date;
}

/**
 * Format a date to a long French format (e.g., "mardi 28 novembre 2023")
 */
export function formatDateLong(date: Date | string): string {
  return toDate(date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Format a date to a short French format (e.g., "28/11/2023")
 */
export function formatDate(date: Date | string): string {
  return toDate(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Format a date with time (e.g., "28/11/2023 à 14:30")
 */
export function formatDateTime(date: Date | string): string {
  const d = toDate(date);
  const dateStr = formatDate(d);
  const timeStr = d.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${dateStr} à ${timeStr}`;
}

/**
 * Check if a date is today
 */
export function isToday(date: Date | string): boolean {
  const d = toDate(date);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

/**
 * Format a date to ISO string format (YYYY-MM-DD)
 */
export function formatDateToString(date: Date): string {
  return date.toISOString().split('T')[0] || '';
}

/**
 * Format a week range in French format (e.g., "28 novembre - 04 décembre 2023")
 */
export function formatWeekRange(monday: Date): string {
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const mondayStr = monday.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long' });
  const sundayStr = sunday.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return `${mondayStr} - ${sundayStr}`;
}

/**
 * Get the Monday of the week containing the given date
 */
export function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

/**
 * Get all 7 days of the week starting from Monday
 */
export function getWeekDays(monday: Date): { monday: Date; sunday: Date } {
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    days.push(day);
  }

  return {
    monday: days[0]!,
    sunday: days[6]!,
  };
}
