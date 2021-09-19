import { createClassName, Override } from '@duely/util';
import React from 'react';
import { Util } from '../../../../util';
import { useFormContext } from '../../Form';
import { FormFieldElementProps } from './FormFieldElementProps';

export type FormFieldRadioBlocksElementProps<
  TName extends string,
  TFormFields extends Record<TName, string> = Record<TName, string>
> = Override<
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  FormFieldElementProps<TName, TFormFields> & {
    dense?: boolean;
    options: (
      | string
      | {
          value: string;
          element?: React.ReactNode;
          description?: React.ReactNode;
          className?: string;
        }
    )[];
  }>;

export function FormFieldRadioBlocksElement<
  TName extends string & keyof TFormFields,
  TFormFields extends Record<string, any> = Record<string, any>
>({
  name,
  registerOptions,
  options,
  loading,
  dense,
  ...props
}: FormFieldRadioBlocksElementProps<TName, TFormFields>) {
  const form = useFormContext();
  const fieldValue = form.useFormFieldValue(name);

  const children =
    (options ?? []).map((option) => {
      const { value, element, description } =
        typeof option === 'object'
          ? option
          : { value: option, element: undefined, description: undefined };
      const className = createClassName(
        fieldValue === value &&
          (props.readOnly || props.disabled ? 'border-gray-400 dark:border-gray-700' : 'border-blue-400'),
        fieldValue !== value && (props.readOnly || props.disabled) && 'opacity-50',
        dense ? 'h-14 text-sm' : 'h-20',
        'text-gray-700 dark:text-gray-300 px-4 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm flex items-center flex-1'
      );

      return (
        <label key={value} htmlFor={`radio-blocks-option-${value}`} className={className}>
          <input
            {...form.register(name, registerOptions)}
            key={value}
            value={value}
            id={`radio-blocks-option-${value}`}
            type="radio"
            hidden
            disabled={loading}
            {...props}
          />
          <div className="space-y-2">
            <span className="font-semibold">{element ?? value}</span>
            {description && <p className="text-xs whitespace-nowrap">{description}</p>}
          </div>
        </label>
      );
    }) ?? [];

  return <div className="grid gap-4 grid-cols-fill-200">{children}</div>;
}
