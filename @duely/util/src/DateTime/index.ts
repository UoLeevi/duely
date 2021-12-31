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

type DateFormat = 'mmm d, yyyy hh:nn UTC' | 'mmm d, yyyy' | 'yyyy-mm-dd' | string;

type FormatDateOptions = {
  tz: 'UTC' | 'local';
};

const defaultFormatDateOptions: FormatDateOptions = {
  tz: 'UTC'
};

export function formatDate(date: Date | number, format?: DateFormat, options?: FormatDateOptions) {
  if (date == null) {
    return date;
  }

  if (typeof date === 'string') {
    return date;
  }

  if (typeof date === 'number') {
    if (date === 0) throw Error('Invalid timestamp');
    if (date < 1e12) date *= 1000;
    date = new Date(date);
  }

  options ??= defaultFormatDateOptions;

  const d = options.tz === 'UTC' ? date.getUTCDate() : date.getDate();
  const dd = String(d).padStart(2, '0');
  const m = options.tz === 'UTC' ? date.getUTCMonth() + 1 : date.getMonth() + 1;
  const mm = String(m).padStart(2, '0');
  const mmm = shortMonthNames[m - 1];
  const y = options.tz === 'UTC' ? date.getUTCFullYear() : date.getFullYear();
  const yyyy = String(y);
  const h = options.tz === 'UTC' ? date.getUTCHours() : date.getHours();
  const hh = String(h).padStart(2, '0');
  const n = options.tz === 'UTC' ? date.getUTCMinutes() : date.getMinutes();
  const nn = String(n).padStart(2, '0');

  format ??= 'mmm d, yyyy hh:nn UTC';

  switch (format) {
    case 'mmm d, yyyy hh:nn UTC':
      return `${mmm} ${d}, ${yyyy} ${hh}:${nn} UTC`;

    case 'mmm d, yyyy':
      return `${mmm} ${d}, ${yyyy}`;

    case 'yyyy-mm-dd':
      return `${yyyy}-${mm}-${dd}`;

    default:
      let result = format as string;
      result = result.replace('yyyy', yyyy);
      result = result.replace('nn', nn);
      result = result.replace('n', n.toString());
      result = result.replace('hh', hh);
      result = result.replace('h', h.toString());
      result = result.replace('dd', dd);
      result = result.replace('d', d.toString());
      result = result.replace('mmm', '§'); // temporary placeholder
      result = result.replace('mm', mm);
      result = result.replace('m', m.toString());
      result = result.replace('§', mmm);
      return result;
  }
}
