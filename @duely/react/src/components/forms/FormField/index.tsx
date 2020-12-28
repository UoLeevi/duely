import type { ImageInput } from '@duely/core';
import React from 'react';
import type { FieldError, RegisterOptions, UseFormMethods } from 'react-hook-form';
import { Util } from '../../../util';
import { LoadingBar } from '../../LoadingBar';

type FormFieldBaseProps<TFieldValues extends Record<string, any> = Record<string, any>> = {
  name: keyof TFieldValues;
  form: UseFormMethods<TFieldValues>;
  label?: React.ReactNode;
  registerOptions?: RegisterOptions;
  hint?: React.ReactNode;
  loading?: boolean;
};

type FormFieldProps<TFieldValues extends Record<string, any> = Record<string, any>> = {
  name: keyof TFieldValues;
  form: UseFormMethods<TFieldValues>;
  label?: React.ReactNode;
  registerOptions?: RegisterOptions;
  hint?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  image?: ImageInput | null;
  actions?: React.ReactNode;
  loading?: boolean;
  options?: (
    | string
    | {
        value: string;
        element?: React.ReactNode;
        description?: React.ReactNode;
        className?: string;
      }
  )[];
} & Omit<
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> &
    React.DetailedHTMLProps<
      React.TextareaHTMLAttributes<HTMLTextAreaElement>,
      HTMLTextAreaElement
    > &
    React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>,
  'form'
>;

export function FormField<TFieldValues extends Record<string, any> = Record<string, any>>({
  name,
  label,
  form,
  type,
  registerOptions,
  hint,
  prefix,
  suffix,
  actions,
  loading,
  options,
  accept,
  image,
  className,
  ...props
}: FormFieldProps<TFieldValues>) {
  const error = form.errors[name] as FieldError | undefined;
  let errorMessage =
    error &&
    (error.message ||
      (error.type === 'required' && 'Required') ||
      (error.type === 'minLength' && 'Too short') ||
      (error.type === 'maxLength' && 'Too long') ||
      (error.type === 'min' && 'Too small') ||
      (error.type === 'max' && 'Too large') ||
      'Invalid');

  const [longErrorMessage, shortErrorMessage] =
    errorMessage?.length! > 20 ? [errorMessage, null] : [null, errorMessage];

  let element;
  let hintOrInfo = hint;

  switch (type) {
    case 'radio-toggle': {
      if (!Array.isArray(options) || options.length !== 2)
        throw new Error('radio-toggle expects options prop as an array containing two items.');
      const [left, right] = options.map((option) =>
        typeof option === 'object' ? option : { value: option }
      );

      const selected = form.watch(name);

      element = (
        <div className="flex">
          <div className="grid items-center grid-cols-3 form-field-radio-toggle">
            <input
              ref={form.register(registerOptions)}
              type="radio"
              id={`radio-toggle-option-${left.value}`}
              name={name}
              value={left.value}
              defaultChecked
              hidden
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
                  (left.value === selected ? left : right).className ?? 'bg-gradient-to-r from-gray-400 to-gray-300'
                }`}
              ></div>
            </div>

            <input
              ref={form.register(registerOptions)}
              type="radio"
              id={`radio-toggle-option-${right.value}`}
              name={name}
              value={right.value}
              hidden
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
      break;
    }

    case 'radio-blocks': {
      const selected = form.watch(name);

      const children =
        (options ?? []).map((option) => {
          const { value, element, description } =
            typeof option === 'object'
              ? option
              : { value: option, element: undefined, description: undefined };
          const className = Util.createClassName(
            selected === value && (props.disabled ? 'border-gray-400' : 'border-blue-400'),
            selected !== value && props.disabled && 'opacity-50',
            'text-gray-700 px-4 border border-gray-300 rounded-md shadow-sm flex items-center h-20 flex-1'
          );

          return (
            <label key={value} htmlFor={`radio-blocks-option-${value}`} className={className}>
              <input
                ref={form.register(registerOptions)}
                key={value}
                value={value}
                id={`radio-blocks-option-${value}`}
                name={name}
                type="radio"
                hidden
                {...props}
              />
              <div className="space-y-2">
                <span className="font-semibold">{element ?? value}</span>
                {description && <p className="text-xs whitespace-nowrap">{description}</p>}
              </div>
            </label>
          );
        }) ?? [];

      element = <div className="grid gap-4 grid-cols-fill-200">{children}</div>;
      break;
    }

    case 'select': {
      const children =
        ['', ...(options ?? [])].map((option) => {
          const { value, element } =
            typeof option === 'object' ? option : { value: option, element: undefined };
          return (
            <option key={value} value={value}>
              {element ?? value}
            </option>
          );
        }) ?? [];

      element = (
        <div className="relative flex items-center border border-gray-300 rounded-md shadow-sm outline-none focus-within:ring sm:text-sm sm:leading-5">
          <select
            id={name}
            name={name}
            ref={form.register(registerOptions)}
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
      break;
    }

    case 'image': {
      const fileList = form.watch(name) as FileList | null;
      const hasFile = (fileList?.length ?? 0) > 0;
      hintOrInfo = hasFile
        ? Array.from(fileList!)
            .map((f) => `${f.name} ${Util.formatFileSize(f.size)}`)
            .join(', ')
        : null;

      loading = !!loading;
      accept = accept ?? 'image/png, image/jpeg';

      const className = Util.createClassName(
        loading && 'animate-pulse border-indigo-400',
        !loading && 'border-gray-300',
        image && 'border border-gray-300 shadow-sm',
        !image && 'px-6 pt-5 pb-6 border-2 border-dashed',
        'relative transition-colors flex justify-center rounded-md'
      );

      element = (
        <label htmlFor={name} className={className}>
          {image && (
            <img
              className="flex-1 object-contain rounded-md"
              src={image.data}
              alt={typeof label === 'string' ? label : ''}
            />
          )}

          {!image && (
            <div className="text-center">
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
          )}

          <input
            disabled={loading}
            id={name}
            name={name}
            ref={form.register(registerOptions)}
            accept={accept}
            type="file"
            hidden
            spellCheck="false"
            autoComplete="off"
            {...props}
          />
        </label>
      );
      break;
    }

    case 'file': {
      const fileList = form.watch(name) as FileList | null;
      const hasFile = (fileList?.length ?? 0) > 0;
      const filenames = hasFile
        ? Array.from(fileList!)
            .map((f) => f.name)
            .join(', ')
        : null;
      hintOrInfo = hasFile
        ? Array.from(fileList!)
            .map((f) => Util.formatFileSize(f.size))
            .join(', ')
        : null;

      element = (
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
            name={name}
            ref={form.register(registerOptions)}
            type="file"
            accept={accept}
            hidden
            spellCheck="false"
            autoComplete="off"
            {...props}
          />
        </label>
      );
      break;
    }

    case 'textarea': {
      element = (
        <div className="flex items-center border border-gray-300 rounded-md shadow-sm outline-none focus-within:ring sm:text-sm sm:leading-5">
          {prefix && <span className="pl-3 text-gray-500">{prefix}</span>}
          <textarea
            id={name}
            name={name}
            ref={form.register(registerOptions)}
            className="w-full py-2 bg-transparent border-none rounded-md outline-none appearance-none first:pl-3 last:pr-3"
            spellCheck="false"
            autoComplete="off"
            {...props}
          />
          {suffix && <span className="pr-3 text-gray-500">{suffix}</span>}
        </div>
      );
      break;
    }

    default: {
      element = (
        <div className="flex items-center border border-gray-300 rounded-md shadow-sm outline-none focus-within:ring sm:text-sm sm:leading-5">
          {prefix && <span className="pl-3 text-gray-500">{prefix}</span>}
          <input
            id={name}
            name={name}
            ref={form.register(registerOptions)}
            type={type}
            className="w-full py-2 bg-transparent border-none rounded-md outline-none appearance-none first:pl-3 last:pr-3"
            spellCheck="false"
            autoComplete="off"
            {...props}
          />
          {suffix && <span className="pr-3 text-gray-500">{suffix}</span>}
        </div>
      );
    }
  }

  className = Util.createClassName('flex flex-col relative', className);

  return (
    <div className={className}>
      <div className="flex justify-between whitespace-nowrap">
        {label && (
          <label className="pb-1 pl-px text-sm font-medium text-gray-700" htmlFor={name}>
            {label}
          </label>
        )}

        {shortErrorMessage ? (
          <p className="text-xs font-medium leading-5 text-red-500">{shortErrorMessage}</p>
        ) : (
          actions
        )}
      </div>

      {element}

      <LoadingBar className="h-px px-1" loading={!!loading} />

      {longErrorMessage ? (
        <p className="pt-1 pl-px m-0 text-xs text-red-500 min-h-4">{longErrorMessage}</p>
      ) : (
        <p className="pt-1 pl-px m-0 text-xs text-gray-500 min-h-4">{hintOrInfo}</p>
      )}
    </div>
  );
}
