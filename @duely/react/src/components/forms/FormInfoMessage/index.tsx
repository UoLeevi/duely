import { createClassName, hasProperty } from '@duely/util';
import React from 'react';
import { Util } from '../../../util';

type FormInfoMessageProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  success?: React.ReactNode;
  info?: React.ReactNode;
  error?: Error | React.ReactNode | { message?: string | null };
};

export function FormInfoMessage({
  success,
  info,
  error,
  children,
  className,
  ...props
}: FormInfoMessageProps) {
  className = createClassName(
    'flex flex-row items-center justify-center space-x-2 font-medium',
    error ? 'text-red-400' : 'text-gray-500',
    className
  );

  if (children) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  return (
    <div className={className} {...props}>
      {error && (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-sm text-center">
            {hasProperty(error, 'message') ? error.message : error}
          </p>
        </>
      )}

      {!error && success && (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5 text-green-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm text-center">{success}</p>
        </>
      )}

      {!error && !success && info && (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm text-center">{info}</p>
        </>
      )}
    </div>
  );
}
