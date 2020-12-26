import React, { useCallback, useEffect } from 'react';
import type {
  DeepPartial,
  SubmitHandler,
  UnpackNestedValue,
  UseFormMethods
} from 'react-hook-form';

type FormProps<TFieldValues extends Record<string, any> = Record<string, any>> = {
  form: UseFormMethods<TFieldValues>;
  onSubmit: SubmitHandler<TFieldValues>;
  values?: UnpackNestedValue<DeepPartial<TFieldValues>>;
} & Omit<
  React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>,
  'onSubmit'
>;

export function Form<TFieldValues extends Record<string, any> = Record<string, any>>({
  form,
  onSubmit,
  values,
  children,
  ...props
}: FormProps<TFieldValues>) {
  const reset = form.reset;

  useEffect(() => {
    if (!values) return;
    reset(values);
  }, [reset, values]);

  const onReset = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      reset();
    },
    [reset]
  );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} onReset={onReset} {...props}>
      {children}
    </form>
  );
}
