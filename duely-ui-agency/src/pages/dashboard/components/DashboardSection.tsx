import { SkeletonText, useHashScrolling } from '@duely/react';
import { createClassName } from '@duely/util';
import React from 'react';

type DashboardSectionProps = {
  title?: React.ReactNode;
  actions?: React.ReactNode;
  loading?: boolean;
} & Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>, 'title'>;

export function DashboardSection({
  title,
  loading,
  children,
  actions,
  className,
  ...props
}: DashboardSectionProps) {
  className = createClassName(className, 'flex flex-col space-y-4 sm:p-2 md:p-3 xl:p-5');

  const [linkRef, hashLink] = useHashScrolling<HTMLHeadingElement>();

  const hasTitle = loading || title || actions;

  return (
    <section className={className} {...props}>
      {hasTitle && (
        <div className="flex flex-row items-center justify-between h-8 space-x-2">
          {loading && (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-400">
              <SkeletonText />
            </h2>
          )}

          {!loading && title && (
            <h2 ref={linkRef} className="text-2xl font-bold text-gray-900 dark:text-gray-400">
              {title}
              {hashLink}
            </h2>
          )}

          {!loading && actions}
        </div>
      )}

      <div className="flex flex-col flex-1 space-y-8">{children}</div>
    </section>
  );
}
