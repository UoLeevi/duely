import type { Override } from '@duely/core';
import React from 'react';
import { useFormContext } from '../../Form';
import { FormFieldElementProps } from './FormFieldElementProps';

export type FormFieldTextAreaElementProps<
  TName extends string,
  TFormFields extends Record<TName, string> = Record<TName, string>
> = Override<
  React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>,
  FormFieldElementProps<TName, TFormFields>
>;

export function FormFieldTextAreaElement<
  TName extends string & keyof TFormFields,
  TFormFields extends Record<string, any> = Record<string, any>
>({ name, registerOptions, loading, ...props }: FormFieldTextAreaElementProps<TName, TFormFields>) {
  const form = useFormContext();
  return (
    <div className="flex items-center border border-gray-300 rounded-md shadow-sm outline-none focus-within:ring sm:text-sm sm:leading-5">
      <textarea
        id={name}
        {...form.register(name, registerOptions)}
        className="w-full py-2 bg-transparent border-none rounded-md outline-none appearance-none first:pl-3 last:pr-3"
        spellCheck="false"
        autoComplete="off"
        readOnly={loading}
        {...props}
      />
    </div>
  );
}
