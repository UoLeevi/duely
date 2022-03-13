import { createClassName } from '@duely/util';
import React from 'react';
import { SkeletonText } from '..';
import { useHashScrolling } from '../../hooks';
import { useQueryState } from '../Query';

export type HeadingProps = {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: '2xl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs';
  children: React.ReactNode;
  dynamic?: boolean;
  loading?: boolean;
};

const classNamesByHeadingLevel = {
  h1: 'text-2xl font-bold tracking-wide text-gray-700 dark:text-gray-300',
  h2: 'text-2xl font-bold tracking-wide text-gray-700 dark:text-gray-300',
  h3: 'text-xl font-bold tracking-wide text-gray-700 dark:text-gray-300',
  h4: 'text-base font-bold tracking-wide text-gray-700 dark:text-gray-300',
  h5: 'text-base font-bold tracking-wide text-gray-700 dark:text-gray-300',
  h6: 'text-base font-bold tracking-wide text-gray-700 dark:text-gray-300'
};

const classNamesBySize = {
  '2xl': '!text-2xl',
  xl: '!text-xl',
  lg: '!text-lg',
  md: '!text-base',
  sm: '!text-sm',
  xs: '!text-xs'
};

export function Heading({ as, size, children, loading, dynamic }: HeadingProps) {
  const [linkRef, hashLink] = useHashScrolling<HTMLHeadingElement>();
  const H = as ?? 'h3';
  const { loading: queryLoading } = useQueryState();
  const className = createClassName(classNamesByHeadingLevel[H], size && classNamesBySize[size]);

  loading ||= queryLoading;

  return (
    <div className="flex items-center space-x-2 group">
      {dynamic && loading && <SkeletonText className={className} ch={15} />}
      {!(dynamic && loading) && (
        <H ref={linkRef} className={className}>
          <div>{children}</div>
          {hashLink}
        </H>
      )}
    </div>
  );
}
