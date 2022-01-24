import React from 'react';
import { createClassName, groupBy, hasProperty } from '@duely/util';
import { Heading, HeadingProps } from '..';

export type BoxProps = {
  children: React.ReactNode;
  className?: string;
};

export const Box = Object.assign(BoxRoot, { Heading: BoxHeading, Action: BoxAction });

export function BoxRoot({ children, className }: BoxProps) {
  className = createClassName('flex flex-col pb-8 md:pb-10', className);

  const groupedChildren = groupBy(React.Children.toArray(children), (child) =>
    hasProperty(child, 'type')
      ? child.type === BoxAction
        ? 'action'
        : child.type === BoxHeading
        ? 'heading'
        : 'content'
      : 'content'
  );

  const heading = groupedChildren.get('heading');
  const actions = groupedChildren.get('action');
  const content = groupedChildren.get('content');

  return (
    <div className={className}>
      {(heading || actions) && (
        <div className="flex justify-between space-x-3 border-b border-black/[.075] pb-3 mb-3">
          {heading}
          <div className="grid grid-flow-row gap-2">{actions}</div>
        </div>
      )}
      {content}
    </div>
  );
}

export type BoxHeadingProps = {
  subheading?: React.ReactNode;
  className?: string;
} & HeadingProps;

function BoxHeading({ subheading, className, ...props }: BoxHeadingProps) {
  className = createClassName('flex flex-col', className);
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

export type BoxActionProps = {
  children?: React.ReactNode;
  className?: string;
};

function BoxAction({ children, className, ...props }: BoxActionProps) {
  className = createClassName('flex', className);
  return <div className={className}>{children}</div>;
}
