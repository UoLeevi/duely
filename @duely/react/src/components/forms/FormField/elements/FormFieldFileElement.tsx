import { formatFileSize, Override } from '@duely/util';
import React from 'react';
import { Util } from '../../../../util';
import { useFormContext } from '../../Form';
import { FormFieldElementProps } from './FormFieldElementProps';

export type FormFieldFileElementProps<
  TName extends string,
  TFormFields extends Record<TName, string> = Record<TName, string>
> = Override<
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  FormFieldElementProps<TName, TFormFields> & {
    accept: string;
    hintRef: React.MutableRefObject<React.ReactNode>;
  }
>;

export function FormFieldFileElement<
  TName extends string & keyof TFormFields,
  TFormFields extends Record<string, any> = Record<string, any>
>({
  name,
  registerOptions,
  accept,
  loading,
  hintRef,
  ...props
}: FormFieldFileElementProps<TName, TFormFields>) {
  const form = useFormContext();
  const fileList = form.useFormFieldValue(name) as FileList | null;
  const fieldState = form.useFormFieldState(name);
  const hasError = !!fieldState?.error;
  const hasFile = (fileList?.length ?? 0) > 0;
  const filenames = hasFile
    ? Array.from(fileList!)
        .map((f) => f.name)
        .join(', ')
    : null;

  hintRef.current = hasFile
    ? Array.from(fileList!)
        .map((f) => formatFileSize(f.size))
        .join(', ')
    : null;

  return (
    <label
      className={`grid px-3 border rounded-md shadow-sm outline-none focus-within:ring sm:text-sm sm:leading-5 ${
        hasError ? 'border-red-400 dark:border-red-600' : 'border-gray-300 dark:border-gray-500'
      }`}
      htmlFor={name}
    >
      {filenames ? (
        <span className="w-full py-2 bg-transparent rounded-md row-span-full col-span-full">
          {filenames}
        </span>
      ) : (
        <span className="w-full py-2 text-gray-500 bg-transparent rounded-md row-span-full col-span-full">
          <span>Upload a file</span> or drag and drop
        </span>
      )}
      <input
        id={name}
        {...form.register(name, registerOptions)}
        type="file"
        accept={accept!}
        hidden
        spellCheck="false"
        autoComplete="off"
        disabled={loading}
        {...props}
      />
    </label>
  );
}
