import type { Override } from '@duely/util';
import React from 'react';
import { useFormContext } from '../../Form';
import { FormFieldElementProps } from './FormFieldElementProps';

export type FormFieldRadioElementProps<
  TName extends string,
  TFormFields extends Record<TName, string> = Record<TName, string>
> = Override<
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  FormFieldElementProps<TName, TFormFields> & {
    dense?: boolean;
  }
>;

export function FormFieldRadioElement<
  TName extends string & keyof TFormFields,
  TFormFields extends Record<string, any> = Record<string, any>
>({
  name,
  registerOptions,
  loading,
  type,
  dense,
  value,
  ...props
}: FormFieldRadioElementProps<TName, TFormFields>) {
  const form = useFormContext();

  return (
    <input
      {...form.register(name, registerOptions)}
      id={`radio-${name}-${value}`}
      value={value}
      type="radio"
      className={`${
        dense ? 'p-2.5' : 'p-3'
      } bg-transparent border border-gray-300 rounded-full shadow-sm outline-none appearance-none dark:border-gray-500 focus-within:ring sm:text-sm sm:leading-5 checked:bg-blue-600 checked:border-transparent form-tick`}
      disabled={loading}
      {...props}
    />
  );
}
