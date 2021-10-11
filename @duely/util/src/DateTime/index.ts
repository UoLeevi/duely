export function timestampToDate(timestamp: number): Date;
export function timestampToDate(timestamp: number | null): Date | null;
export function timestampToDate(timestamp: number | undefined): Date | undefined;
export function timestampToDate(timestamp: null): null;
export function timestampToDate(timestamp: undefined): undefined;
export function timestampToDate(timestamp: number | null | undefined): Date | null | undefined {
  return timestamp === undefined
    ? undefined
    : timestamp === null
    ? null
    : new Date(timestamp * 1000);
}

export function dateToTimestamp(date: Date): number;
export function dateToTimestamp(date: Date | null): number | null;
export function dateToTimestamp(date: Date | undefined): number | undefined;
export function dateToTimestamp(date: null): null;
export function dateToTimestamp(date: undefined): undefined;
export function dateToTimestamp(date: Date | null | undefined): number | null | undefined {
  return date === undefined ? undefined : date === null ? null : Math.round(date.getTime() / 1000);
}

const shortMonthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

type DateFormat = 'mmm d, yyyy hh:nn UTC' | 'mmm d, yyyy' | 'yyyy-mm-dd';

export function formatDate(date: Date | number, format?: DateFormat) {
  if (typeof date === 'number') {
    if (date === 0) throw Error('Invalid timestamp');
    if (date < 1e12) date *= 1000;
    date = new Date(date);
  }

  const d = date.getUTCDate();
  const dd = String(d).padStart(2, '0');
  const m = date.getUTCMonth();
  const mm = String(m).padStart(2, '0');
  const mmm = shortMonthNames[m];
  const y = date.getUTCFullYear();
  const yyyy = String(y);
  const h = date.getUTCHours();
  const hh = String(h).padStart(2, '0');
  const n = date.getUTCMinutes();
  const nn = String(n).padStart(2, '0');

  format ??= 'mmm d, yyyy hh:nn UTC';

  switch (format) {
    case 'mmm d, yyyy hh:nn UTC':
      return `${mmm} ${d}, ${yyyy} ${hh}:${nn} UTC`;

    case 'mmm d, yyyy':
      return `${mmm} ${d}, ${yyyy}`;

    case 'yyyy-mm-dd':
      return `${yyyy}-${mm}-${dd}`;
  }
}
