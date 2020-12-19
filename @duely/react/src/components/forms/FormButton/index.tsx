import React from 'react';
import { Util } from '../../../util';
import { LoadingSpinner } from '../../LoadingSpinner';

type FormButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  loading?: boolean;
  dense?: boolean;
};

export function FormButton({ children, type, disabled, loading, dense, className, ...props }: FormButtonProps) {
  disabled = !!(disabled || loading);
  className = Util.createClassName(
    'relative flex justify-center items-center appearance-none bg-indigo-500 rounded-md text-md font-medium leading-5 text-white transition duration-150 ease-in-out focus:outline-none focus-visible:outline-none focus-visible:ring shadow-sm',
    dense ? 'px-9 py-2' : 'px-12 py-3',
    className
  );

  return (
    <button type={type} disabled={disabled} className={className} { ...props }>
      <LoadingSpinner loading={loading} className={`absolute left-0 ${dense ? 'h-5 ml-2' : 'h-6 ml-3' }`} />
      { children }
    </button>
  );
}
