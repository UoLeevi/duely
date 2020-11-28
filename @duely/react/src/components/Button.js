import React from 'react';
import { Util } from '../util';
import { LoadingSpinner } from './LoadingSpinner';

export function Button({ children, type, disabled, loading, spinner, className, ...props }) {
  disabled = !!(disabled || loading);
  className = Util.createClassName(
    'relative inline-flex justify-center items-center appearance-none rounded-md font-medium leading-5 transition duration-150 ease-in-out focus:outline-none focus-visible:outline-none focus-visible:ring shadow-sm border border-transparent',
    spinner && 'px-9',
    className
  );

  return (
    <button type={type} disabled={disabled} className={className} { ...props }>
      { spinner && <LoadingSpinner loading={loading} className="absolute left-0 ml-2 text-xl" /> }
      { children }
    </button>
  );
}
