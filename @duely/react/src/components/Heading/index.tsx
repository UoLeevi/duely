import React from 'react';
import { useHashScrolling } from '../../hooks';

export type HeadingProps = {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: React.ReactNode;
};

const classNamesByHeadingLevel = {
  h1: 'text-2xl font-bold tracking-wide text-gray-700 dark:text-gray-300',
  h2: 'text-2xl font-bold tracking-wide text-gray-700 dark:text-gray-300',
  h3: 'text-base font-bold tracking-wide text-gray-700 dark:text-gray-300',
  h4: 'text-base font-bold tracking-wide text-gray-700 dark:text-gray-300',
  h5: 'text-base font-bold tracking-wide text-gray-700 dark:text-gray-300',
  h6: 'text-base font-bold tracking-wide text-gray-700 dark:text-gray-300'
};

export function Heading({ as, children }: HeadingProps) {
  const [linkRef, hashLink] = useHashScrolling<HTMLHeadingElement>();
  const H = as ?? 'h3';

  return (
    <div className="flex items-center space-x-2 group">
      <H ref={linkRef} className={classNamesByHeadingLevel[H]}>
        <div>{children}</div>
        {hashLink}
      </H>
    </div>
  );
}
