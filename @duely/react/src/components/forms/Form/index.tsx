import React, { useCallback, createContext, useContext } from 'react';
import { useForm, UseFormReturn } from '../hooks';

const FormContext = createContext<ReturnType<typeof useForm>>(undefined as any);

export function useFormContext() {
  return useContext(FormContext);
}

type FormProps<TFormFields extends Record<string, any> = Record<string, any>> = {
  form: UseFormReturn<TFormFields>;
  onSubmit: (data: TFormFields, event?: React.BaseSyntheticEvent) => any | Promise<any>;
} & Omit<
  React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>,
  'onSubmit'
>;

export function Form<TFormFields extends Record<string, any> = Record<string, any>>({
  form,
  onSubmit,
  children,
  ...props
}: FormProps<TFormFields>) {
  
  const onReset = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.reset();
  }, []);

  return (
    <FormContext.Provider value={form as any}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} onReset={onReset} {...props}>
        {children}
      </form>
    </FormContext.Provider>
  );
}
