import type { Override } from '@duely/util';
import React from 'react';
import { FormField } from '..';
import { DropMenu } from '../../..';
import { useFormContext } from '../../Form';
import { FormFieldElementProps } from './FormFieldElementProps';

export type FormFieldMultiSelectElementProps<
  TName extends string,
  TFormFields extends Record<TName, string> = Record<TName, string>
> = Override<
  React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>,
  FormFieldElementProps<TName, TFormFields> & {
    multiple: true;
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
  }
>;

export function FormFieldMultiSelectElement<
  TName extends string & keyof TFormFields,
  TFormFields extends Record<string, any> = Record<string, any>
>({
  name,
  registerOptions,
  options,
  loading,
  ...props
}: FormFieldMultiSelectElementProps<TName, TFormFields>) {
  const form = useFormContext();

  const items =
    options?.map((option) =>
      typeof option === 'object' ? option : { value: option, element: undefined }
    ) ?? [];

  const { fields } = form.useFieldArray(name, {
    items,
    loading: loading,
    keyField: 'value',
    returnTrueValues: true
  });

  const values: string[] | undefined = form.useFieldArrayValue(name);
  const elements = values
    ?.map((value) => items!.find((option) => option.value === value))
    .map((option) => option?.element ?? option?.value);

  return (
    <DropMenu full-width unmount={false}>
      <DropMenu.Button as={React.Fragment}>
        <div className="relative flex items-center border border-gray-300 rounded-md shadow-sm outline-none dark:border-gray-500 focus-within:ring sm:text-sm sm:leading-5">
          <div className="w-full py-2 pl-3 pr-10 bg-transparent border-none rounded-md">
            <span
              data-content="&nbsp;"
              className="empty:before:content-[attr(data-content)] text-ellipsis"
            >
              {elements?.join(', ')}
            </span>
          </div>
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
      </DropMenu.Button>
      {fields.map((field) => (
        <div key={field.key} className="w-full px-4 py-1.5 first:pt-3 last:pb-3">
          <FormField
            dense
            type="checkbox"
            name={field.getName(field.item!.value)}
            label={field.item!.element ?? field.item!.value}
          />
        </div>
      ))}
    </DropMenu>
  );
}
