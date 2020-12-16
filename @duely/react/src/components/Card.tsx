import React from 'react';
import { Util } from '../util';

type CardProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

export function Card({ className, children, ...props }: CardProps) {
  className = Util.createClassName(className, 'flex flex-col w-full bg-white border shadow-sm rounded-md');
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}
