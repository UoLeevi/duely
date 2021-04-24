import React from 'react';
import { Util } from '../../../util';
import { LoadingSpinner } from '../../LoadingSpinner';
import { UseFormReturn } from 'react-hook-form';

type FormButtonProps<TFieldValues extends Record<string, any> = Record<string, any>> = {
  form: UseFormReturn<TFieldValues>;
  spinner?: boolean;
  loading?: boolean;
  dense?: boolean;
} & Omit<
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
  'form'
>;

export function FormButton<TFieldValues extends Record<string, any> = Record<string, any>>({
  form,
  children,
  type,
  disabled,
  loading,
  spinner,
  dense,
  className,
  ...props
}: FormButtonProps<TFieldValues>) {
  spinner = spinner || loading;
  disabled = !!(disabled || loading || !form.formState.isDirty);
  className = Util.createClassName(
    'relative flex justify-center tracking-wide items-center border whitespace-nowrap appearance-none rounded-md text-md font-medium transition duration-150 ease-in-out focus:outline-none focus-visible:outline-none focus-visible:ring shadow-sm',
    type === 'reset'
      ? 'bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100'
      : 'bg-indigo-500 text-white border-transparent hover:bg-indigo-600',
    spinner ? (dense ? 'px-9 py-1.5' : 'px-12 py-2.5') : dense ? 'px-4 py-1.5' : 'px-7 py-2.5',
    !loading && 'disabled:opacity-50',
    className
  );

  return (
    <button type={type} disabled={disabled} className={className} {...props}>
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
