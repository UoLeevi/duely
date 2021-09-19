import React from 'react';
import { createClassName } from '@duely/util';

type CardProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export function Card({ className, children, ...props }: CardProps) {
  className = createClassName(className, 'flex flex-col w-full bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm rounded-md');
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}
