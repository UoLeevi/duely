import type { Override } from '@duely/util';
import React from 'react';
import { useFormContext } from '../../Form';
import { FormFieldElementProps } from './FormFieldElementProps';

export type FormFieldSelectElementProps<
  TName extends string,
  TFormFields extends Record<TName, string> = Record<TName, string>
> = Override<
  React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>,
  FormFieldElementProps<TName, TFormFields> & {
    multiple?: false;
    options:
      | (
          | string
          | {
              value: string;
              group?: string;
              element?: React.ReactNode;
              description?: React.ReactNode;
              className?: string;
            }
        )[]
      | undefined;
  }
>;

function createOption(
  option:
    | string
    | {
        value: string;
        group?: string;
        element?: React.ReactNode;
        description?: React.ReactNode;
        className?: string;
      }
): {
  value: string;
  group?: string;
  element?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
} {
  return typeof option === 'object' ? option : { value: option, element: undefined };
}

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
  const fieldState = form.useFormFieldState(name);
  const hasError = !!fieldState?.error;

  options = options ? options.slice() : [];

  const children: React.ReactNode[] = [];
  children.push(<option key="" className="dark:bg-gray-800"></option>);

  while (options.length > 0) {
    const option = createOption(options.shift()!);
    if (!option.group) {
      children.push(
        <option key={option.value} value={option.value} className="dark:bg-gray-800">
          {option.element ?? option.value}
        </option>
      );
    } else {
      const group = option.group;
      const groupedOptions: typeof option[] = [];

      for (let i = options.length - 1; i >= 0; --i) {
        const option = createOption(options[i]);
        if (option.group === group) {
          options.splice(i, 1);
          groupedOptions.unshift(option);
        }
      }

      children.push(
        <optgroup key={`group-${option.group}`} label={option.group}>
          <option value={option.value} className="dark:bg-gray-800">
            {option.element ?? option.value}
          </option>
          {groupedOptions.length > 0 &&
            groupedOptions.map((option) => (
              <option key={option.value} value={option.value} className="dark:bg-gray-800">
                {option.element ?? option.value}
              </option>
            ))}
        </optgroup>
      );
    }
  }

  return (
    <div
      className={`relative flex items-center border rounded-md shadow-sm outline-none focus-within:ring sm:text-sm sm:leading-5 ${
        hasError ? 'border-red-400 dark:border-red-600' : 'border-gray-300 dark:border-gray-500'
      }`}
    >
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
