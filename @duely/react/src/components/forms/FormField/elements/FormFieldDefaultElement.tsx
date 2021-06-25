import type { Override } from '@duely/core';
import React from 'react';
import { useFormContext } from '../../Form';
import { FormFieldElementProps } from './FormFieldElementProps';

export type FormFieldDefaultElementProps<
  TName extends string,
  TFormFields extends Record<TName, string> = Record<TName, string>
> = Override<
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  FormFieldElementProps<TName, TFormFields> & {
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
  }
>;

export function FormFieldDefaultElement<
  TName extends string & keyof TFormFields,
  TFormFields extends Record<string, any> = Record<string, any>
>({
  name,
  registerOptions,
  loading,
  prefix,
  suffix,
  type,
  ...props
}: FormFieldDefaultElementProps<TName, TFormFields>) {
  const form = useFormContext();
  return (
    <div className="flex items-center border border-gray-300 rounded-md shadow-sm outline-none focus-within:ring sm:text-sm sm:leading-5">
      {prefix && <span className="pl-3 text-gray-500">{prefix}</span>}
      <input
        id={name}
        {...form.register(name, registerOptions)}
        type={type}
        className="w-full py-2 bg-transparent border-none rounded-md outline-none appearance-none first:pl-3 last:pr-3"
        spellCheck="false"
        autoComplete="off"
        readOnly={loading}
        {...props}
      />
      {suffix && <span className="pr-3 text-gray-500">{suffix}</span>}
    </div>
  );
}
