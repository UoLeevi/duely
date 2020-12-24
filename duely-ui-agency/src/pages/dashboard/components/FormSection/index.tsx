import React from 'react';
import { Util, useHashScrolling } from '@duely/react';

type SettingsLayoutProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  ref?: React.RefObject<HTMLElement>;
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

export function FormSection({
  title,
  description,
  children,
  className,
  id,
  ...props
}: SettingsLayoutProps) {
  className = Util.createClassName(
    className,
    'relative flex flex-col px-5 pt-4 pb-5 -m-2 xl:-m-4 xl:flex-row'
  );

  const [linkRef, hashLink] = useHashScrolling<HTMLHeadingElement>();

  return (
    <section className={className} {...props}>
      <div className="flex flex-col items-start m-2 space-y-1 xl:m-4 xl:w-1/3 2xl:w-1/4">
        <div className="flex items-center space-x-2 group">
          <h3 ref={linkRef} className="font-bold tracking-wide text-gray-700">
            {title}
            {hashLink}
          </h3>
        </div>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <div className="flex flex-col m-2 xl:m-4 xl:w-2/3 2xl:w-3/4">{children}</div>
    </section>
  );
}
