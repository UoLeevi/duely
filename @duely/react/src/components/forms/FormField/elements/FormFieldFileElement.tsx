import React from 'react';
import { Util } from '../../../../util';
import { useFormContext } from '../../Form';
import { FormFieldElementProps } from './FormFieldElementProps';

export type FormFieldFileElementProps<
  TName extends string,
  TFormFields extends Record<TName, string> = Record<TName, string>
> = Omit<
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  keyof FormFieldElementProps<TName, TFormFields>
> &
  FormFieldElementProps<TName, TFormFields> & {
    accept: string;
  };

export function FormFieldFileElement<
  TName extends string & keyof TFormFields,
  TFormFields extends Record<string, any> = Record<string, any>
>({
  name,
  registerOptions,
  accept,
  loading,
  label,
  hint,
  hintOrInfoRef,
  prefix,
  suffix,
  ...props
}: FormFieldFileElementProps<TName, TFormFields>) {
  const form = useFormContext();
  const fileList = form.useFormFieldValue(name) as FileList | null;
  const hasFile = (fileList?.length ?? 0) > 0;
  const filenames = hasFile
    ? Array.from(fileList!)
        .map((f) => f.name)
        .join(', ')
    : null;

  hintOrInfoRef.current = hasFile
    ? Array.from(fileList!)
        .map((f) => Util.formatFileSize(f.size))
        .join(', ')
    : null;

  return (
    <label
      className="grid px-3 border border-gray-300 rounded-md shadow-sm outline-none focus-within:ring sm:text-sm sm:leading-5"
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
        {...props}
      />
    </label>
  );
}
