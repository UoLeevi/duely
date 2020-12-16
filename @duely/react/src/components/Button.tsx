import React from 'react';
import { Util } from '../util';
import { LoadingSpinner } from './LoadingSpinner';

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  loading: boolean;
  spinner: boolean;
};

export function Button({ children, disabled, loading, spinner, className, ...props }: ButtonProps) {
  disabled = !!(disabled || loading);
  className = Util.createClassName(
    'relative inline-flex items-center justify-center font-medium leading-5 transition duration-150 ease-in-out border border-transparent rounded-md shadow-sm appearance-none focus:outline-none focus-visible:outline-none focus-visible:ring',
    spinner && 'px-9',
    className
  );

  return (
    <button disabled={disabled} className={className} {...props}>
      {spinner && <LoadingSpinner loading={loading} className="absolute left-0 ml-2 text-xl" />}
      {children}
    </button>
  );
}
