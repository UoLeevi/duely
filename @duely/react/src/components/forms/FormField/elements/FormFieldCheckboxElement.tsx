import type { Override } from '@duely/util';
import React from 'react';
import { useFormContext } from '../../Form';
import { FormFieldElementProps } from './FormFieldElementProps';

export type FormFieldCheckboxElementProps<
  TName extends string,
  TFormFields extends Record<TName, string> = Record<TName, string>
> = Override<
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  FormFieldElementProps<TName, TFormFields>
>;

export function FormFieldCheckboxElement<
  TName extends string & keyof TFormFields,
  TFormFields extends Record<string, any> = Record<string, any>
>({
  name,
  registerOptions,
  loading,
  type,
  ...props
}: FormFieldCheckboxElementProps<TName, TFormFields>) {
  const form = useFormContext();

  return (
    <input
      id={name}
      {...form.register(name, registerOptions)}
      type="checkbox"
      className="p-3 bg-transparent border border-gray-300 rounded-md shadow-sm outline-none appearance-none dark:border-gray-500 focus-within:ring sm:text-sm sm:leading-5 checked:bg-blue-600 checked:border-transparent form-tick"
      disabled={loading}
      {...props}
    />
  );
}
