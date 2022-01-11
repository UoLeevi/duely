import React from 'react';
import { createClassName } from '@duely/util';
import { Heading, HeadingProps } from '..';

export type BoxProps = {
  children: React.ReactNode;
  className?: string;
};

export const Box = Object.assign(BoxRoot, { Heading: BoxHeading });

export function BoxRoot({ children, className }: BoxProps) {
  className = createClassName('pb-8 md:pb-10', className);
  return <div className={className}>{children}</div>;
}

export type BoxHeadingProps = {
  subheading?: React.ReactNode;
  className?: string;
} & HeadingProps;

function BoxHeading({ subheading, className, ...props }: BoxHeadingProps) {
  className = createClassName('flex flex-col border-b border-black/[.075] pb-3 mb-3', className);
  return (
    <div className={className}>
      {typeof subheading !== 'string' ? (
        subheading
      ) : (
        <span className="text-xs font-bold tracking-wide uppercase text-gray-450">
          {subheading}
        </span>
      )}
      <Heading {...props} />
    </div>
  );
}
