import { Util, useHashScrolling } from '@duely/react';
import { createClassName } from '@duely/util';

type H3Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

function H3({ children, className, ...props }: H3Props) {
  className = createClassName(className, 'font-bold tracking-wide text-gray-700 group');
  const [linkRef, hashLink] = useHashScrolling<HTMLHeadingElement>();

  return (
    <h3 {...props} ref={linkRef} className={className}>
      {children}
      {hashLink}
    </h3>
  );
}
