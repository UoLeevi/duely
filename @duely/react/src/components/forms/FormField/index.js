import React from 'react';
import { BsChevronDown } from 'react-icons/bs';
import { Util } from '../../../util';
import { IconImageAdd } from '../../IconImageAdd';
import { LoadingBar } from '../../LoadingBar';

export function FormField({ name, label, form, type, validateRule, hint, prefix, suffix, actions, loading, options, accept, src, className, ...props }) {

  const error = form.errors[name];
  let errorMessage = error && (error.message
    || (error.type === 'required' && 'Required')
    || (error.type === 'minLength' && 'Too short')
    || (error.type === 'maxLength' && 'Too long')
    || (error.type === 'min' && 'Too small')
    || (error.type === 'max' && 'Too large')
    || 'Invalid');

  const [longErrorMessage, shortErrorMessage] = errorMessage?.length > 20
    ? [errorMessage, null]
    : [null, errorMessage];

  let element;
  let hintOrInfo = hint;

  switch (type) {
    case 'radio-blocks': {
      const selected = form.watch(name);

      options = (options ?? []).map(option => {
        const { value, element, description } = typeof option === 'object' ? option : { value: option };
        const className = Util.createClassName(selected === value && 'border-blue-400', 'text-gray-700 px-4 border border-gray-300 rounded-md shadow-sm flex items-center h-20 flex-1');

        return (
          <label key={value} htmlFor={value} className={className}>
            <input ref={form.register(validateRule)} key={value} value={value} id={value} name={name} type="radio" hidden {...props} />
            <div className="space-y-2">
              <span className="font-semibold">{element ?? value}</span>
              {description && <p className="text-xs whitespace-no-wrap">{description}</p>}
            </div>
          </label>
        );
      }) ?? [];

      element = (
        <div className="grid gap-4 grid-cols-fill-200">
          { options}
        </div>
      );
      break;
    }

    case 'select': {
      options = ['', ...(options ?? [])].map(option => {
        const { value, element } = typeof option === 'object' ? option : { value: option };
        return <option key={value} value={value}>{element ?? value}</option>;
      }) ?? [];

      element = (
        <div className="relative flex items-center outline-none border border-gray-300 rounded-md focus-within:shadow-outline shadow-sm sm:text-sm sm:leading-5">
          <select id={name} name={name} ref={form.register(validateRule)} className="w-full rounded-md bg-transparent appearance-none outline-none border-none py-2 pl-3 pr-10" spellCheck="false" autoComplete="off" children={options} {...props} />
          <BsChevronDown className="absolute pointer-events-none mr-3 right-0 text-gray-600" />
        </div>
      );
      break;
    }

    case 'image': {
      const fileList = form.watch(name);
      const hasFile = fileList?.length > 0;
      hintOrInfo = hasFile ? Array.from(fileList).map(f => `${f.name} ${Util.formatFileSize(f.size)}`).join(', ') : null;

      loading = !!loading;
      accept = accept ?? 'image/png, image/jpeg';

      const className = Util.createClassName(loading && 'animate-pulse border-indigo-400', 'relative flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md');

      element = (
        <label htmlFor={name} className={className}>
          {src && <img className="flex-1 object-contain" src={src} alt={label ?? ''} {...props} />}

          {!src && (
            <div className="text-center">
              <IconImageAdd className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-1 text-sm text-gray-600">
                <span className="font-medium cursor-pointer text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition duration-150 ease-in-out">Upload a file</span>
                <span> or drag and drop</span>
              </p>
              <p className="mt-1 text-xs text-gray-500">{hint ?? accept.replaceAll('image/', '').toUpperCase()}</p>
            </div>
          )}

          <input disabled={loading} id={name} name={name} ref={form.register(validateRule)} accept={accept} type="file" hidden spellCheck="false" autoComplete="off" {...props} />
        </label>
      );
      break;
    }

    case 'file': {
      const fileList = form.watch(name);
      const hasFile = fileList?.length > 0;
      const filenames = hasFile ? Array.from(fileList).map(f => f.name).join(', ') : null;
      hintOrInfo = hasFile ? Array.from(fileList).map(f => Util.formatFileSize(f.size)).join(', ') : null;

      element = (
        <label className="grid px-3 outline-none border border-gray-300 rounded-md focus-within:shadow-outline shadow-sm sm:text-sm sm:leading-5" htmlFor={name}>
          {filenames
            ? <span className="row-span-full col-span-full w-full rounded-md bg-transparent py-2">{filenames}</span>
            : <span className="row-span-full col-span-full w-full rounded-md bg-transparent py-2 text-gray-500"><span>Upload a file</span> or drag and drop</span>
          }
          <input id={name} name={name} ref={form.register(validateRule)} type="file" accept={accept} hidden spellCheck="false" autoComplete="off" {...props} />
        </label>
      );
      break;
    }

    case 'textarea': {
      element = (
        <div className="flex items-center outline-none border border-gray-300 rounded-md focus-within:shadow-outline shadow-sm sm:text-sm sm:leading-5">
          {prefix && <span className="text-gray-500 pl-3">{prefix}</span>}
          <textarea id={name} name={name} ref={form.register(validateRule)} className="w-full rounded-md bg-transparent appearance-none outline-none border-none py-2 first:pl-3 last:pr-3" spellCheck="false" autoComplete="off" {...props} />
          {suffix && <span className="text-gray-500 pr-3">{suffix}</span>}
        </div>
      );
      break;
    }

    default: {
      element = (
        <div className="flex items-center outline-none border border-gray-300 rounded-md focus-within:shadow-outline shadow-sm sm:text-sm sm:leading-5">
          {prefix && <span className="text-gray-500 pl-3">{prefix}</span>}
          <input id={name} name={name} ref={form.register(validateRule)} type={type} className="w-full rounded-md bg-transparent appearance-none outline-none border-none py-2 first:pl-3 last:pr-3" spellCheck="false" autoComplete="off" {...props} />
          {suffix && <span className="text-gray-500 pr-3">{suffix}</span>}
        </div>
      );
    }
  }

  className = Util.createClassName(
    'flex flex-col relative',
    className
  );

  return (
    <div className={className}>
      <div className="flex justify-between whitespace-no-wrap">
        {label && <label className="text-gray-700 font-medium text-sm leading-7 pl-px" htmlFor={name}>{label}</label>}

        {shortErrorMessage
          ? <p className="text-red-500 text-xs leading-5 font-medium">{shortErrorMessage}</p>
          : actions
        }
      </div>

      {element}

      <LoadingBar className="h-px px-1" loading={!!loading} />

      {longErrorMessage
        ? <p className="text-red-500 text-xs min-h-4 m-0 pl-px pt-1">{longErrorMessage}</p>
        : <p className="text-gray-500 text-xs min-h-4 m-0 pl-px pt-1">{hintOrInfo}</p>
      }
    </div>
  );
}
