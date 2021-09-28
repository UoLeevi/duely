import type { Override } from '@duely/util';
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
    suggestions?: (
      | string
      | {
          value: string;
          element?: string;
        }
    )[];
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
  suggestions,
  type,
  ...props
}: FormFieldDefaultElementProps<TName, TFormFields>) {
  const form = useFormContext();

  if (suggestions) {
    props.list = `${name}--suggestions`;
  }

  return (
    <>
      <div className="flex items-center border border-gray-300 rounded-md shadow-sm outline-none dark:border-gray-500 focus-within:ring sm:text-sm sm:leading-5">
        {prefix && <span className="pl-3 text-gray-500 whitespace-nowrap">{prefix}</span>}
        <input
          id={name}
          {...form.register(name, registerOptions)}
          type={type}
          className="w-full py-2 bg-transparent border-none rounded-md outline-none appearance-none first:pl-3 last:pr-3"
          spellCheck="false"
          autoComplete={props.autoComplete ?? 'off'}
          disabled={loading}
          {...props}
        />
        {suffix && <span className="pr-3 text-gray-500 whitespace-nowrap">{suffix}</span>}
      </div>

      {suggestions && suggestions.length > 0 && (
        <datalist id={`${name}--suggestions`}>
          {suggestions.map((suggestion) => {
            suggestion =
              typeof suggestion === 'object'
                ? suggestion
                : { value: suggestion, element: undefined };

            const value = suggestion.value;

            return (
              <option key={suggestion.value} onClick={() => form.setValue(name, value)}>
                {suggestion.element ?? suggestion.value}
              </option>
            );
          })}
        </datalist>
      )}
    </>
  );
}
