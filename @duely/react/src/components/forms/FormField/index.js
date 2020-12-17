import React from 'react';
import { Util } from '../../../util';
import { IconImageAdd } from '../../IconImageAdd';
import { LoadingBar } from '../../LoadingBar';

export function FormField({
  name,
  label,
  form,
  type,
  validateRule,
  hint,
  prefix,
  suffix,
  actions,
  loading,
  options,
  accept,
  src,
  className,
  ...props
}) {
  const error = form.errors[name];
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
    errorMessage?.length > 20 ? [errorMessage, null] : [null, errorMessage];

  let element;
  let hintOrInfo = hint;

  switch (type) {
    case 'radio-blocks': {
      const selected = form.watch(name);

      options =
        (options ?? []).map((option) => {
          const { value, element, description } =
            typeof option === 'object' ? option : { value: option };
          const className = Util.createClassName(
            selected === value && 'border-blue-400',
            'text-gray-700 px-4 border border-gray-300 rounded-md shadow-sm flex items-center h-20 flex-1'
          );

          return (
            <label key={value} htmlFor={value} className={className}>
              <input
                ref={form.register(validateRule)}
                key={value}
                value={value}
                id={value}
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

      element = <div className="grid gap-4 grid-cols-fill-200">{options}</div>;
      break;
    }

    case 'select': {
      options =
        ['', ...(options ?? [])].map((option) => {
          const { value, element } = typeof option === 'object' ? option : { value: option };
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
            ref={form.register(validateRule)}
            className="w-full py-2 pl-3 pr-10 bg-transparent border-none rounded-md outline-none appearance-none"
            spellCheck="false"
            autoComplete="off"
            children={options}
            {...props}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute right-0 mr-3 text-gray-600 pointer-events-none"
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
      const fileList = form.watch(name);
      const hasFile = fileList?.length > 0;
      hintOrInfo = hasFile
        ? Array.from(fileList)
            .map((f) => `${f.name} ${Util.formatFileSize(f.size)}`)
            .join(', ')
        : null;

      loading = !!loading;
      accept = accept ?? 'image/png, image/jpeg';

      const className = Util.createClassName(
        loading && 'animate-pulse border-indigo-400',
        'relative flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md'
      );

      element = (
        <label htmlFor={name} className={className}>
          {src && <img className="flex-1 object-contain" src={src} alt={label ?? ''} {...props} />}

          {!src && (
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
                {hint ?? accept.replaceAll('image/', '').toUpperCase()}
              </p>
            </div>
          )}

          <input
            disabled={loading}
            id={name}
            name={name}
            ref={form.register(validateRule)}
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
      const fileList = form.watch(name);
      const hasFile = fileList?.length > 0;
      const filenames = hasFile
        ? Array.from(fileList)
            .map((f) => f.name)
            .join(', ')
        : null;
      hintOrInfo = hasFile
        ? Array.from(fileList)
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
            ref={form.register(validateRule)}
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
            ref={form.register(validateRule)}
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
            ref={form.register(validateRule)}
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
          <label className="pl-px text-sm font-medium leading-7 text-gray-700" htmlFor={name}>
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
