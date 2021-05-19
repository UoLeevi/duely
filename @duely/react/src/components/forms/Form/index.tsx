import React, { useCallback, createContext, useContext, useRef } from 'react';
import type { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { useRerender } from '../../../hooks';

type FormFieldHTMLElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;

type FormFieldInfo<T = any> = {
  defaultValue?: T;
  domElement?: FormFieldHTMLElement;
};

const FormContext =
  createContext<
    | {
        setDefaultValue(name: string, value: any): void;
        register(name: string): { ref: (el: FormFieldHTMLElement) => void };
      }
    | undefined
  >(undefined);

export function useForm2<TFormFields extends Record<string, any> = Record<string, any>>() {
  const fieldsRef = useRef(new Map<string, FormFieldInfo>());
  const rerender = useRerender();
  const setDefaultValue = useCallback((name: string, value: any) => {
    const fields = fieldsRef.current;
    let field = fields.get(name);

    if (field === undefined) {
      field = {};
      fields.set(name, field);
    }

    field.defaultValue = value;

    if (field.domElement) {
      field.domElement.value = value ?? '';
      rerender();
    }
  }, [rerender]);

  const register = useCallback((name: string) => {
    const fields = fieldsRef.current;
    let field = fields.get(name);

    if (field === undefined) {
      field = {};
      fields.set(name, field);
    }

    return {
      ref: (el: FormFieldHTMLElement) => {
        console.log('registered', el);
        field!.domElement = el;

        if (field?.domElement && !field.domElement.value) {
          field.domElement.value = field.defaultValue ?? '';
          rerender();
        }
      }
    };
  }, [rerender]);

  const watch = useCallback((name: string) => {
    const fields = fieldsRef.current;
    let field = fields.get(name);
    return field?.domElement?.value;
  }, [rerender]);

  return {
    control: fieldsRef,
    register,
    setDefaultValue,
    watch
  };
}

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
