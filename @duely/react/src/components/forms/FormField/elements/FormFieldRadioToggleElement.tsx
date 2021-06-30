import type { Override } from '@duely/core';
import React from 'react';
import { Util } from '../../../../util';
import { useFormContext } from '../../Form';
import { FormFieldElementProps } from './FormFieldElementProps';

export type FormFieldRadioToggleElementProps<
  TName extends string,
  TFormFields extends Record<TName, string> = Record<TName, string>
> = Override<
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  FormFieldElementProps<TName, TFormFields> & {
    options: [
      left:
        | string
        | {
            value: string;
            element?: React.ReactNode;
            description?: React.ReactNode;
            className?: string;
          },
      right:
        | string
        | {
            value: string;
            element?: React.ReactNode;
            description?: React.ReactNode;
            className?: string;
          }
    ];
  }>;

export function FormFieldRadioToggleElement<
  TName extends string & keyof TFormFields,
  TFormFields extends Record<string, any> = Record<string, any>
>({
  name,
  registerOptions,
  options,
  loading,
  ...props
}: FormFieldRadioToggleElementProps<TName, TFormFields>) {
  const form = useFormContext();
  const fieldValue = form.useFormFieldValue(name);

  if (!Array.isArray(options) || options.length !== 2)
    throw new Error('radio-toggle expects options prop as an array containing two items.');
  const [left, right] = options.map((option) =>
    typeof option === 'object' ? option : { value: option }
  );

  return (
    <div className="flex">
      <div className="grid items-center grid-cols-3 form-field-radio-toggle">
        <input
          {...form.register(name, registerOptions)}
          type="radio"
          id={`radio-toggle-option-${left.value}`}
          value={left.value}
          hidden
          disabled={loading}
          {...props}
        />
        <label htmlFor={`radio-toggle-option-${left.value}`} className="grid row-start-1">
          <span className="pr-3 font-medium tracking-wide text-right">
            {left.element ?? Util.sentenceCase(left.value)}
          </span>
        </label>

        <div className="relative w-12 h-8 col-start-2 row-start-1 border border-gray-300 rounded-md shadow-sm outline-none pointer-events-none sm:text-sm sm:leading-5">
          <div
            className={`box-border grid place-items-center absolute inset-y-0 w-6 m-px transition border-2 border-transparent rounded-md bg-clip-content ${
              (left.value === fieldValue ? left : right).className ??
              'bg-gradient-to-r from-gray-400 to-gray-300'
            }`}
          ></div>
        </div>

        <input
          {...form.register(name, registerOptions)}
          type="radio"
          id={`radio-toggle-option-${right.value}`}
          value={right.value}
          hidden
          disabled={loading}
          {...props}
        />
        <label htmlFor={`radio-toggle-option-${right.value}`} className="grid row-start-1">
          <span className="pl-3 font-medium tracking-wide text-left">
            {right.element ?? Util.sentenceCase(right.value)}
          </span>
        </label>
      </div>
    </div>
  );
}
