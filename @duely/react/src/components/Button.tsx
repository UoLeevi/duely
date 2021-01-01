import React from 'react';
import { Util } from '../util';
import { LoadingSpinner } from './LoadingSpinner';

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  spinner?: boolean;
  loading?: boolean;
  dense?: boolean;
};

export function Button({
  children,
  disabled,
  loading,
  spinner,
  dense,
  className,
  ...props
}: ButtonProps) {
  spinner = spinner || loading;
  disabled = !!(disabled || loading);
  className = Util.createClassName(
    'relative flex justify-center tracking-wide items-center border appearance-none rounded-md text-md font-medium transition duration-150 ease-in-out focus:outline-none focus-visible:outline-none focus-visible:ring shadow-sm',
    spinner ? (dense ? 'px-9 py-1.5' : 'px-12 py-2.5') : dense ? 'px-4 py-1.5' : 'px-7 py-2.5',
    !loading && 'disabled:opacity-50',
    className
  );

  return (
    <button disabled={disabled} className={className} {...props}>
      {spinner && (
        <LoadingSpinner
          loading={loading}
          className={`absolute left-0 ${dense ? 'h-5 ml-2' : 'h-6 ml-3'}`}
        />
      )}
      {children}
    </button>
  );
}
