import React from 'react';
import { SkeletonText } from '..';
import { useHashScrolling } from '../../hooks';
import { useQueryState } from '../Query';

export type HeadingProps = {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: React.ReactNode;
  dynamic?: boolean;
};

const classNamesByHeadingLevel = {
  h1: 'text-2xl font-bold tracking-wide text-gray-700 dark:text-gray-300',
  h2: 'text-2xl font-bold tracking-wide text-gray-700 dark:text-gray-300',
  h3: 'text-xl font-bold tracking-wide text-gray-700 dark:text-gray-300',
  h4: 'text-base font-bold tracking-wide text-gray-700 dark:text-gray-300',
  h5: 'text-base font-bold tracking-wide text-gray-700 dark:text-gray-300',
  h6: 'text-base font-bold tracking-wide text-gray-700 dark:text-gray-300'
};

export function Heading({ as, children, dynamic }: HeadingProps) {
  const [linkRef, hashLink] = useHashScrolling<HTMLHeadingElement>();
  const H = as ?? 'h3';
  const { loading } = useQueryState();

  return (
    <div className="flex items-center space-x-2 group">
      {dynamic && loading && <SkeletonText className={classNamesByHeadingLevel[H]} ch={15} />}
      {!(dynamic && loading) && (
        <H ref={linkRef} className={classNamesByHeadingLevel[H]}>
          <div>{children}</div>
          {hashLink}
        </H>
      )}
    </div>
  );
}
