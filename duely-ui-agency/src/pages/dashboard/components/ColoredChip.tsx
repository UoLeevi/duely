import { Util } from '@duely/react';

type Color = 'gray' | 'green' | 'orange' | 'indigo' | 'blue';

type ColoredChipProps = {
  text: string;
  color: Color | string | ((text: string) => string) | { [text: string]: string };
};

export function ColoredChip({ text, color }: ColoredChipProps) {
  let colorClassName: string;

  if (typeof color === 'function') {
    color = color(text);
  } else if (typeof color === 'object') {
    color = color[text];
  }

  // NOTE: simple concatenation would mess up the PurgeCSS
  switch (color) {
    case 'green':
      colorClassName = 'bg-green-100 text-green-800';
      break;
    case 'orange':
      colorClassName = 'bg-orange-100 text-orange-800';
      break;
    case 'indigo':
      colorClassName = 'bg-indigo-100 text-indigo-800';
      break;
    case 'blue':
      colorClassName = 'bg-blue-100 text-blue-800';
      break;
    default:
      colorClassName = 'bg-gray-100 text-gray-800';
      break;
  }

  const className =
    'w-16 px-2 py-1 text-xs font-medium tracking-wider text-center rounded-md min-w-max ' +
    colorClassName;

  return <span className={className}>{Util.sentenceCase(text)}</span>;
}
