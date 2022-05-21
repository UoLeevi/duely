import React from 'react';
import { createClassName, sentenceCase } from '@duely/util';
import { getIconElement, IconProp } from './icons';
import { SkeletonText } from './skeletons';

type Color =
  | 'gray'
  | 'green'
  | 'orange'
  | 'red'
  | 'indigo'
  | 'blue'
  | 'gray-text'
  | 'green-text'
  | 'orange-text'
  | 'red-text'
  | 'indigo-text'
  | 'blue-text';

type ColoredChipProps = {
  text?: string;
  color: Color | string | ((text: string) => string) | { [text: string]: string };
  icon?: IconProp | ((text: string) => IconProp);
  dense?: boolean;
};

export function ColoredChip({ text, color, icon, dense }: ColoredChipProps) {
  let colorClassName: string;

  if (text !== undefined) {
    if (typeof color === 'function') {
      color = color(text);
    } else if (typeof color === 'object') {
      color = color[text];
    }
  }

  if (text !== undefined) {
    if (typeof icon === 'function') {
      icon = icon(text);
    }
  }

  icon = getIconElement(icon as IconProp);

  // NOTE: simple concatenation would mess up the PurgeCSS
  switch (color) {
    case 'green':
      colorClassName = 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100';
      break;
    case 'orange':
      colorClassName = 'bg-orange-100 text-orange-700 dark:bg-orange-700 dark:text-orange-100';
      break;
    case 'red':
      colorClassName = 'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100';
      break;
    case 'indigo':
      colorClassName = 'bg-indigo-100 text-indigo-700 dark:bg-indigo-700 dark:text-indigo-100';
      break;
    case 'blue':
      colorClassName = 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100';
      break;
    case 'green-text':
      colorClassName = 'text-green-700 dark:text-green-200';
      break;
    case 'orange-text':
      colorClassName = 'text-orange-700 dark:text-orange-200';
      break;
    case 'red-text':
      colorClassName = 'text-red-700 dark:text-red-200';
      break;
    case 'indigo-text':
      colorClassName = 'text-indigo-700 dark:text-indigo-200';
      break;
    case 'blue-text':
      colorClassName = 'text-blue-700 dark:text-blue-200';
      break;
    case 'gray-text':
      colorClassName = 'text-gray-700 dark:text-gray-200';
      break;
    default:
      colorClassName = 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100';
      break;
  }

  const className = createClassName(
    'text-xs font-medium tracking-wider text-center rounded-md min-w-max whitespace-nowrap',
    icon && 'flex items-center space-x-1 flex-grow-0',
    dense ? 'px-1.5 py-0.5' : 'w-16 px-2 py-1',
    colorClassName
  );

  return (
    <span className={className}>
      {text ? (
        <>
          <span>{sentenceCase(text)}</span>
          {icon}
        </>
      ) : (
        <SkeletonText ch={6} />
      )}
    </span>
  );
}
