import React from 'react';
import { createClassName, groupBy, hasProperty } from '@duely/util';
import { Heading, HeadingProps } from '..';
import { getIconElement, IconProp } from '../icons';

export type BoxProps = {
  children: React.ReactNode;
  className?: string;
  row?: boolean;
  col?: boolean;
};

export const Box = Object.assign(BoxRoot, { Heading: BoxHeading, Action: BoxAction });

export function BoxRoot({ children, className, row, col }: BoxProps) {
  className = createClassName('flex flex-col pb-8 md:pb-10', className);
  col ??= !row;
  row ??= !col;

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
      <div className={createClassName('flex gap-3', col ? 'flex-col' : 'flex-row flex-wrap')}>
        {content}
      </div>
    </div>
  );
}

export type BoxHeadingProps = {
  subheading?: React.ReactNode;
  subheadingIcon?: IconProp;
  className?: string;
} & HeadingProps;

function BoxHeading({ subheading, subheadingIcon, className, ...props }: BoxHeadingProps) {
  const icon = getIconElement(subheadingIcon);
  className = createClassName('flex flex-col', className);
  return (
    <div className={className}>
      {typeof subheading !== 'string' ? (
        subheading
      ) : (
        <span className="inline-flex items-center space-x-1.5 text-xs font-bold tracking-wide uppercase text-gray-450">
          {icon}
          <span className="inline-block">{subheading}</span>
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
