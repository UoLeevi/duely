import { SkeletonText, Util, useHashScrolling } from '@duely/react';
import React from 'react';

type DashboardSectionProps = {
  title?: string;
  loading?: boolean;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

export function DashboardSection({
  title,
  loading,
  children,
  className,
  ...props
}: DashboardSectionProps) {
  className = Util.createClassName(className, 'flex flex-col space-y-4 sm:p-2 md:p-3 xl:p-5');

  const [linkRef, hashLink] = useHashScrolling<HTMLHeadingElement>();

  return (
    <section className={className} {...props}>
      {loading && (
        <h2 className="text-xl font-semibold text-center text-gray-900 sm:text-left">
          <SkeletonText />
        </h2>
      )}

      {!loading && title && (
        <h2 ref={linkRef} className="self-center text-xl font-semibold text-gray-900 sm:self-start">
          {title}
          {hashLink}
        </h2>
      )}

      <div className="flex flex-col space-y-8">{children}</div>
    </section>
  );
}
