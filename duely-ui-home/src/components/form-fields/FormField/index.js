export default function FormField({ name, label, form, type, validateRule, hint, actions, options, ...props }) {

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
    options = ['', ...options].map(option => {
      const { value, element } = typeof option === 'object' ? option : { value: option };
      return <option key={value} value={value}>{element ?? value}</option>;
    }) ?? [];
  }

  return (
    <div className="flex flex-col relative">
      <div className="flex justify-between">
        <label className="text-label" htmlFor={name}>{label}</label>

        {shortErrorMessage
          ? <p className="text-red-500 text-xs leading-5 font-medium">{shortErrorMessage}</p>
          : actions
        }
      </div>

      {type === 'select'
        ? <select name={name} ref={form.register(validateRule)} className="input-text-base" spellCheck="false" autoComplete="off" children={options} {...props} />
        : <input name={name} ref={form.register(validateRule)} type={type} className="input-text-base" spellCheck="false" autoComplete="off" {...props} />
      }

      {longErrorMessage
        ? <p className="text-red-500 text-xs italic h-4">{longErrorMessage}</p>
        : <p className="text-gray-500 text-xs italic h-4">{hint}</p>
      }
    </div>
  );
}
