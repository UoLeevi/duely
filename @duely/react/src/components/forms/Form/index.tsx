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
  form: UseFormReturn<TFieldValues>;
  form2: ReturnType<typeof useForm2>;
  onSubmit: SubmitHandler<TFieldValues>;
} & Omit<
  React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>,
  'onSubmit'
>;

export function Form<TFieldValues extends Record<string, any> = Record<string, any>>({
  form,
  form2,
  onSubmit,
  children,
  ...props
}: FormProps<TFieldValues>) {
  const rerender = useRerender();

  const onReset = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fields = form2.control.current;
    fields.forEach((field) => {
      if (field?.domElement) {
        field.domElement.value = field.defaultValue ?? '';
      }
    });
    rerender();
  }, []);

  return (
    <FormContext.Provider value={form2}>
      <form onSubmit={form.handleSubmit(onSubmit)} onReset={onReset} {...props}>
        {children}
      </form>
    </FormContext.Provider>
  );
}
