import { SkeletonText, Util, useHashScrolling } from '@duely/react';
import React from 'react';

type DashboardSectionProps = {
  title?: string;
  actions?: React.ReactNode;
  loading?: boolean;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

export function DashboardSection({
  title,
  loading,
  children,
  actions,
  className,
  ...props
}: DashboardSectionProps) {
  className = Util.createClassName(className, 'flex flex-col space-y-4 sm:p-2 md:p-3 xl:p-5');

  const [linkRef, hashLink] = useHashScrolling<HTMLHeadingElement>();

  return (
    <section className={className} {...props}>
      <div className="flex flex-row items-center justify-between h-8 space-x-2">
        {loading && (
          <h2 className="text-xl font-semibold text-gray-900">
            <SkeletonText />
          </h2>
        )}

        {!loading && title && (
          <h2
            ref={linkRef}
            className="text-xl font-semibold text-gray-900"
          >
            {title}
            {hashLink}
          </h2>
        )}

        {!loading && actions}
      </div>

      <div className="flex flex-col space-y-8">{children}</div>
    </section>
  );
}
