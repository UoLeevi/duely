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

export function formatDate(d: Date) {
  return `${d.getUTCDate()} ${
    shortMonthNames[d.getUTCMonth()]
  } ${d.getUTCFullYear()} ${d.getUTCHours()}:${String(d.getUTCMinutes()).padStart(2, '0')} UTC`;
}
