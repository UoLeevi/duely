import LoadingBar from 'components/LoadingBar';

export default function FormField({ name, label, form, type, validateRule, hint, prefix, suffix, actions, loading, options, ...props }) {

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

  if (type === 'select') {
    options = ['', ...(options ?? [])].map(option => {
      const { value, element } = typeof option === 'object' ? option : { value: option };
      return <option key={value} value={value}>{element ?? value}</option>;
    }) ?? [];
  }

  let element;

  switch (type) {
    case 'select':
      element = (
        <select id={name} name={name} ref={form.register(validateRule)} className="appearance-none outline-none border bg-white border-gray-300 rounded-md px-3 py-2 focus:shadow-outline shadow-sm" spellCheck="false" autoComplete="off" children={options} {...props} />
      );
      break;

    case 'file':
      const fileList = form.watch(name);
      const filenames = fileList?.length > 0 ? Array.from(fileList).map(f => f.name).join(', ') : null;
      element = (
        <label className="grid px-3 outline-none border border-gray-300 rounded-md focus-within:shadow-outline shadow-sm" htmlFor={name}>
          {filenames
            ? <span className="row-span-full col-span-full w-full rounded-md bg-transparent py-2">{filenames}</span>
            : <span className="row-span-full col-span-full w-full rounded-md bg-transparent py-2 text-gray-500">Drop a file here or click to upload</span>
          }
          <input id={name} name={name} ref={form.register(validateRule)} type="file" className="hidden row-span-full col-span-full w-full rounded-md bg-transparent appearance-none outline-none border-none py-2" spellCheck="false" autoComplete="off" {...props} />
        </label>
      );
      break;

    default:
      element = (
        <div className="flex items-center outline-none border border-gray-300 rounded-md focus-within:shadow-outline shadow-sm">
          {prefix && <span className="text-gray-500 pl-3">{prefix}</span>}
          <input id={name} name={name} ref={form.register(validateRule)} type={type} className="w-full rounded-md bg-transparent appearance-none outline-none border-none py-2 first:pl-3 last:pr-3" spellCheck="false" autoComplete="off" {...props} />
          {suffix && <span className="text-gray-500 pr-3">{suffix}</span>}
        </div>
      );
  }

  return (
    <div className="flex flex-col relative">
      <div className="flex justify-between">
        <label className="text-gray-700 font-medium text-sm leading-6" htmlFor={name}>{label}</label>

        {shortErrorMessage
          ? <p className="text-red-500 text-xs leading-5 font-medium">{shortErrorMessage}</p>
          : actions
        }
      </div>

      {element}

      <LoadingBar className="h-px mx-1" loading={!!loading} />

      {longErrorMessage
        ? <p className="text-red-500 text-xs italic min-h-4">{longErrorMessage}</p>
        : <p className="text-gray-500 text-xs italic min-h-4">{hint}</p>
      }
    </div>
  );
}
