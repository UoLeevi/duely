export default function FormField({ name, label, form, type, validateRule, hint, actions, ...props }) {

  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <label className="text-label" htmlFor={name}>{label}</label>
        <p className="text-red-500 text-xs leading-5 font-medium">{form.errors[name] && <span>Required</span>}</p>
        {!form.errors[name] && actions}
      </div>
      <input name={name} ref={form.register(validateRule)} type={type} className="text-input-base" {...props} />
      <p className="text-gray-500 text-xs italic h-4">{<span>{hint}</span>}</p>
    </div>
  );
}
