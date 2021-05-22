import React, { useCallback, createContext, useContext } from 'react';
import type { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { useRerender } from '../../../hooks';
import { useForm2, UseForm2Return, FormState } from './useForm2';

export { useForm2, FormState };

const FormContext = createContext<ReturnType<typeof useForm2>>(undefined as any);

export function useFormContext2() {
  return useContext(FormContext);
}

type FormProps<TFormFields extends Record<string, any> = Record<string, any>> = {
  form: UseForm2Return<TFormFields>;
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
