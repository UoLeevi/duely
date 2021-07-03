import { Override, ImageInput } from '@duely/core';
import React from 'react';
import { Util } from '../../../../util';
import { useFormContext } from '../../Form';
import { FormFieldElementProps } from './FormFieldElementProps';

export type FormFieldImageElementProps<
  TName extends string,
  TFormFields extends Record<TName, string> = Record<TName, string>
> = Override<
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  FormFieldElementProps<TName, TFormFields> & {
    accept: string;
    image?: ImageInput | null;
    hintRef: React.MutableRefObject<React.ReactNode>;
    label?: React.ReactNode;
    hint?: React.ReactNode;
  }
>;

export function FormFieldImageElement<
  TName extends string & keyof TFormFields,
  TFormFields extends Record<string, any> = Record<string, any>
>({
  name,
  registerOptions,
  accept,
  image,
  loading,
  hintRef,
  hint,
  label,
  ...props
}: FormFieldImageElementProps<TName, TFormFields>) {
  const form = useFormContext();
  const fileList = form.useFormFieldValue(name) as FileList | null;
  const hasFile = (fileList?.length ?? 0) > 0;
  hintRef.current = hasFile
    ? Array.from(fileList!)
        .map((f) => `${f.name} ${Util.formatFileSize(f.size)}`)
        .join(', ')
    : null;

  loading = !!loading;
  accept = accept ?? 'image/png, image/jpeg';

  const className = Util.createClassName(
    loading && 'animate-pulse border-indigo-400',
    !loading && 'border-gray-300 dark:border-gray-500',
    image && 'border m-px border-gray-300 dark:border-gray-500 shadow-sm',
    !image && 'border-2 border-dashed',
    'relative aspect-w-3 aspect-h-2 transition-colors flex justify-center rounded-md'
  );

  return (
    <label htmlFor={name} className={className}>
      {image && (
        <img
          className="flex-1 object-cover rounded-md"
          src={image.data}
          alt={typeof label === 'string' ? label : ''}
        />
      )}

      {!image && (
        <div className="grid text-center place-items-center">
          <div>
            <svg
              className="w-12 h-12 mx-auto text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
            <p className="mt-1 text-sm text-gray-600">
              <span className="font-medium text-indigo-600 transition duration-150 ease-in-out cursor-pointer hover:text-indigo-500 focus:outline-none focus:underline">
                Upload a file
              </span>
              <span> or drag and drop</span>
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {hint ?? accept!.split('image/').join('').toUpperCase()}
            </p>
          </div>
        </div>
      )}

      <input
        id={name}
        {...form.register(name, registerOptions)}
        disabled={loading}
        accept={accept}
        type="file"
        hidden
        spellCheck="false"
        autoComplete="off"
        {...props}
      />
    </label>
  );
}
