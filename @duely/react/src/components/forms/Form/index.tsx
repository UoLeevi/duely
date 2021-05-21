import React, { useCallback, createContext, useContext } from 'react';
import type { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { useRerender } from '../../../hooks';
import { useForm2 } from './useForm2';

export { useForm2 };

const FormContext = createContext<ReturnType<typeof useForm2>>(undefined as any);

export function useFormContext2() {
  return useContext(FormContext);
}

type FormProps<TFieldValues extends Record<string, any> = Record<string, any>> = {
  form: ReturnType<typeof useForm2>;
  onSubmit: (data: TFieldValues, event?: React.BaseSyntheticEvent) => any | Promise<any>;
} & Omit<
  React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>,
  'onSubmit'
>;

export function Form<TFieldValues extends Record<string, any> = Record<string, any>>({
  form,
  onSubmit,
  children,
  ...props
}: FormProps<TFieldValues>) {
  
  const onReset = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.reset();
  }, []);

  return (
    <FormContext.Provider value={form}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} onReset={onReset} {...props}>
        {children}
      </form>
    </FormContext.Provider>
  );
}
