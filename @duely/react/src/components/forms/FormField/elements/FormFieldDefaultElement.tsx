import type { Override } from '@duely/util';
import React from 'react';
import { DropMenu } from '../../../DropMenu';
import { Animation } from '../../../Animation';
import { icons } from '../../../icons';
import { LoadingSpinner } from '../../../LoadingSpinner';
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
  } & (
      | {
          suggestionType: 'custom';
          suggestionsLoading?: boolean;
          suggestions?: (
            | string
            | {
                value: string;
                element?: React.ReactNode;
                onSelect?: (value: string) => void;
              }
          )[];
        }
      | {
          suggestionType?: 'datalist';
          suggestionsLoading?: boolean;
          suggestions?: (
            | string
            | {
                value: string;
                element?: string;
              }
          )[];
        }
    )
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
  suggestionsLoading,
  suggestionType,
  type,
  ...props
}: FormFieldDefaultElementProps<TName, TFormFields>) {
  const form = useFormContext();
  const fieldState = form.useFormFieldState(name);
  const hasError = !!fieldState?.error;

  suggestionType ??= 'custom';

  if (suggestions && suggestionType === 'datalist') {
    props.list = `${name}--suggestions`;
  }

  return (
    <>
      <div
        className={`flex items-center border rounded-md shadow-sm outline-none focus-within:ring sm:text-sm sm:leading-5 ${
          hasError ? 'border-red-400 dark:border-red-600' : 'border-gray-300 dark:border-gray-500'
        }`}
      >
        {prefix && <span className="pl-3 text-gray-500 whitespace-nowrap">{prefix}</span>}
        <input
          id={name}
          {...form.register(name, registerOptions)}
          type={type}
          className="w-full min-h-[1em] py-2 bg-transparent border-none rounded-md outline-none appearance-none first:pl-3 last:pr-3"
          spellCheck="false"
          autoComplete={props.autoComplete ?? 'off'}
          disabled={loading}
          {...props}
        />
        {suffix && <span className="pr-3 text-gray-500 whitespace-nowrap">{suffix}</span>}

        <span className="pr-3 pl-1.5 text-gray-500 whitespace-nowrap">
          {
            <Animation.Fade>
              {suggestionsLoading && (
                <LoadingSpinner loading={suggestionsLoading} className="hidden group-focus-within:inline-block !text-current w-[1.25em] h-[1.25em]" />
              )}
            </Animation.Fade>
          }
        </span>
      </div>

      {suggestionType === 'datalist' && suggestions && suggestions.length > 0 && (
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

      {suggestionType === 'custom' && suggestions && suggestions.length > 0 && (
        <DropMenu open no-button full-width className='hidden group-focus-within:inline-flex'>
          {suggestions.map((suggestion) => {
            suggestion =
              typeof suggestion === 'object'
                ? suggestion
                : { value: suggestion, element: undefined, onSelect: undefined };

            const value = suggestion.value;

            return (
              <DropMenu.Item
                key={suggestion.value}
                onClick={() => {
                  (suggestion as Exclude<typeof suggestion, string>).onSelect?.(value);
                  form.setValue(name, value);
                }}
              >
                {suggestion.element ?? suggestion.value}
              </DropMenu.Item>
            );
          })}
        </DropMenu>
      )}
    </>
  );
}
