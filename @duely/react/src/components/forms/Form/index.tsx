import React, { useCallback, createContext, useContext, useRef } from 'react';
import type { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { useRerender } from '../../../hooks';

type FormFieldInfo<T = any> = {
  defaultValue?: T;
  ref?: any;
};

const FormContext =
  createContext<
    | {
        setDefaultValue(name: string, value: any): void;
      }
    | undefined
  >(undefined);

export function useForm2() {
  return useContext(FormContext);
}

type FormProps<TFieldValues extends Record<string, any> = Record<string, any>> = {
  form: UseFormReturn<TFieldValues>;
  onSubmit: SubmitHandler<TFieldValues>;
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
  const fieldsRef = useRef(new Map<string, FormFieldInfo>());
  const { reset } = form;

  const onReset = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const defaultValues = Object.fromEntries(
        Array.from(fieldsRef.current, ([name, field]) => [name, field.defaultValue])
      );

      reset(defaultValues as any);
    },
    [reset]
  );

  function setDefaultValue(name: string, value: any): void {
    const fields = fieldsRef.current;
    let field = fields.get(name);

    if (field === undefined) {
      field = {};
      fields.set(name, field);
    }

    field.defaultValue = value;
  }

  return (
    <FormContext.Provider value={{ setDefaultValue }}>
      <form onSubmit={form.handleSubmit(onSubmit)} onReset={onReset} {...props}>
        {children}
      </form>
    </FormContext.Provider>
  );
}
