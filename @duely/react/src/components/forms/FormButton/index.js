import React from 'react';
import { Util } from '../../../util';
import { LoadingSpinner } from '../../LoadingSpinner';

export function FormButton({ children, type, disabled, loading, className, ...props }) {
  disabled = !!(disabled || loading);
  className = Util.createClassName(
    'relative flex justify-center items-center appearance-none bg-indigo-500 px-12 py-3 rounded-md text-md font-medium leading-5 text-white transition duration-150 ease-in-out focus:outline-none focus-visible:outline-none focus-visible:ring shadow-sm',
    className
  );

  return (
    <button type={type} disabled={disabled} className={className} { ...props }>
      <LoadingSpinner loading={loading} className="absolute left-0 ml-3 text-xl" />
      { children }
    </button>
  );
}
