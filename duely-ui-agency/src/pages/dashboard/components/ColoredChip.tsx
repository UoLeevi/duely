import { SkeletonText, Util } from '@duely/react';

type Color = 'gray' | 'green' | 'orange' | 'red' | 'indigo' | 'blue';

type ColoredChipProps = {
  text?: string;
  color: Color | string | ((text: string) => string) | { [text: string]: string };
};

export function ColoredChip({ text, color }: ColoredChipProps) {
  let colorClassName: string;

  if (text !== undefined) {
    if (typeof color === 'function') {
      color = color(text);
    } else if (typeof color === 'object') {
      color = color[text];
    }
  }

  // NOTE: simple concatenation would mess up the PurgeCSS
  switch (color) {
    case 'green':
      colorClassName = 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100';
      break;
    case 'orange':
      colorClassName = 'bg-orange-100 text-orange-800 dark:bg-orange-700 dark:text-orange-100';
      break;
    case 'red':
      colorClassName = 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100';
      break;
    case 'indigo':
      colorClassName = 'bg-indigo-100 text-indigo-800 dark:bg-indigo-700 dark:text-indigo-100';
      break;
    case 'blue':
      colorClassName = 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100';
      break;
    default:
      colorClassName = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
      break;
  }

  const className =
    'w-16 px-2 py-1 text-xs font-medium tracking-wider text-center rounded-md min-w-max whitespace-nowrap ' +
    colorClassName;

  return (
    <span className={className}>{text ? Util.sentenceCase(text) : <SkeletonText ch={6} />}</span>
  );
}
