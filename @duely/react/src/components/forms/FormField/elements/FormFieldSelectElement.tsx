import type { Override } from '@duely/core';
import React from 'react';
import { useFormContext } from '../../Form';
import { FormFieldElementProps } from './FormFieldElementProps';

export type FormFieldSelectElementProps<
  TName extends string,
  TFormFields extends Record<TName, string> = Record<TName, string>
> = Override<
  React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>,
  FormFieldElementProps<TName, TFormFields> & {
    options:
      | (
          | string
          | {
              value: string;
              element?: React.ReactNode;
              description?: React.ReactNode;
              className?: string;
            }
        )[]
      | undefined;
  }>;

export function FormFieldSelectElement<
  TName extends string & keyof TFormFields,
  TFormFields extends Record<string, any> = Record<string, any>
>({
  name,
  registerOptions,
  options,
  loading,
  ...props
}: FormFieldSelectElementProps<TName, TFormFields>) {
  const form = useFormContext();
  const children =
    ['', ...(options ?? [])].map((option) => {
      const { value, element } =
        typeof option === 'object' ? option : { value: option, element: undefined };
      return (
        <option key={value} value={value} className="dark:bg-gray-900 dark:bg-gray-800">
          {element ?? value}
        </option>
      );
    }) ?? [];

  return (
    <div className="relative flex items-center border border-gray-300 rounded-md shadow-sm outline-none dark:border-gray-500 focus-within:ring sm:text-sm sm:leading-5">
      <select
        id={name}
        {...form.register(name, registerOptions)}
        className="w-full py-2 pl-3 pr-10 bg-transparent border-none rounded-md outline-none appearance-none"
        spellCheck="false"
        autoComplete="off"
        {...props}
      >
        {children}
      </select>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute right-0 w-5 h-5 mr-3 text-gray-600 pointer-events-none"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}
