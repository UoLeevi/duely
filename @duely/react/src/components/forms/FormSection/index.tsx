import { createClassName } from '@duely/util';
import React from 'react';
import { Heading } from '../..';
import { useHashScrolling } from '../../../hooks';

type FormSectionProps = {
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
}: FormSectionProps) {
  className = createClassName(className, 'relative flex flex-col px-5 pt-4 pb-5');

  const [linkRef, hashLink] = useHashScrolling<HTMLHeadingElement>();

  return (
    <section className={className} {...props}>
      <Heading>{title}</Heading>
      <div className="flex flex-col -m-2 xl:-m-4 xl:flex-row">
        <div className="flex flex-col items-start pt-1 m-2 xl:m-4 xl:w-1/3 2xl:w-1/4">
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <div className="flex flex-col m-2 xl:m-4 xl:w-2/3 2xl:w-3/4">{children}</div>
      </div>
    </section>
  );
}
