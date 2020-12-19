import React from 'react';
import { Util } from '../../../util';

type FormErrorFieldProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  error?: Error | string | null | { message?: string | null };
};

export function FormErrorInfo({ error, className, ...props }: FormErrorFieldProps) {
  if (!error) return null;

  className = Util.createClassName(
    'flex flex-row items-center justify-center text-red-400 space-x-3 font-semibold',
    className
  );

  return (
    <div className={className} {...props}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <p className="text-sm text-center">{typeof error === 'string' ? error : error?.message}</p>
    </div>
  );
}
