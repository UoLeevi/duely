import React from 'react';
import { createClassName, groupBy, hasProperty } from '@duely/util';
import { Heading, HeadingProps } from '..';
import { getIconElement, IconProp } from '../icons';
import { Link, LinkProps, NavLink, useLocation, useRouteMatch } from 'react-router-dom';

export type SectionProps = {
  children: React.ReactNode;
  className?: string;
  row?: boolean;
  col?: boolean;
};

export const Section = Object.assign(SectionRoot, {
  Heading: SectionHeading,
  Action: SectionAction,
  TabLink: SectionTabLink
});

export function SectionRoot({ children, className, row, col }: SectionProps) {
  className = createClassName('flex flex-col pb-8 md:pb-10', className);
  col ??= !row;
  row ??= !col;

  const groupedChildren = groupBy(React.Children.toArray(children), (child) =>
    hasProperty(child, 'type')
      ? child.type === SectionAction
        ? 'action'
        : child.type === SectionHeading
        ? 'heading'
        : child.type === SectionTabLink
        ? 'tab-link'
        : 'content'
      : 'content'
  );

  const heading = groupedChildren.get('heading');
  const actions = groupedChildren.get('action');
  const tabLinks = groupedChildren.get('tab-link');
  const content = groupedChildren.get('content');

  return (
    <section className={className}>
      {(heading || actions) && (
        <div className="flex flex-col border-b border-black/[.075] mb-3">
          <div className="flex justify-between pb-3 space-x-3">
            {heading}
            <div className="grid grid-flow-row gap-2">{actions}</div>
          </div>
          {(tabLinks?.length ?? 0) > 0 && <div className="flex space-x-6">{tabLinks}</div>}
        </div>
      )}
      <div className={createClassName('flex gap-3', col ? 'flex-col' : 'flex-row flex-wrap')}>
        {content}
      </div>
    </section>
  );
}

export type SectionHeadingProps = {
  subheading?: React.ReactNode;
  subheadingIcon?: IconProp;
  className?: string;
} & HeadingProps;

function SectionHeading({ subheading, subheadingIcon, className, ...props }: SectionHeadingProps) {
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

export type SectionActionProps = {
  children?: React.ReactNode;
  className?: string;
};

function SectionAction({ children, className, ...props }: SectionActionProps) {
  className = createClassName('flex', className);
  return <div className={className}>{children}</div>;
}

export type SectionTabLinkProps = {
  children?: React.ReactNode;
  className?: string;
  to: string;
} & Omit<LinkProps, 'to'>;

function SectionTabLink({ children, className, to, ...props }: SectionTabLinkProps) {
  const location = useLocation();
  const url = new URL(to, window.location.href);
  const searchParams = new URLSearchParams(location.search);

  let isActive = location.pathname === url.pathname;

  for (const [key, value] of url.searchParams.entries()) {
    if (value === '') {
      isActive &&= !searchParams.has(key);
      url.searchParams.delete(key);
    } else {
      isActive &&= searchParams.get(key) === value;
    }
  }

  to = url.pathname + url.search + url.hash;

  className = createClassName(
    'text-sm font-medium -mb-[1px] border-b-2 pb-0.5',
    isActive
      ? 'text-indigo-600 border-indigo-500'
      : 'text-gray-500 hover:text-gray-700 focus-within:text-gray-800 border-transparent',
    className
  );
  return (
    <Link className={className} to={to} {...props}>
      {children}
    </Link>
  );
}
