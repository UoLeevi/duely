import React, { useCallback, useEffect } from 'react';
import type {
  DeepPartial,
  SubmitHandler,
  UnpackNestedValue,
  UseFormReturn
} from 'react-hook-form';
import { Util } from '@duely/core';

type FormProps<TFieldValues extends Record<string, any> = Record<string, any>> = {
  form: UseFormReturn<TFieldValues>;
  onSubmit: SubmitHandler<TFieldValues>;
  values?: UnpackNestedValue<DeepPartial<TFieldValues>> | null;
  defaultValues?: UnpackNestedValue<DeepPartial<TFieldValues>> | null;
} & Omit<
  React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>,
  'onSubmit'
>;

export function Form<TFieldValues extends Record<string, any> = Record<string, any>>({
  form,
  onSubmit,
  values,
  defaultValues,
  children,
  ...props
}: FormProps<TFieldValues>) {
  const { reset, getValues } = form;
  defaultValues = defaultValues ?? values;

  useEffect(() => {
    if (!values) return;
    const resetValues = Util.pick(values, getValues());
    reset(resetValues as any);
  }, [reset, getValues, JSON.stringify(values)]);

  const onReset = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const resetValues = defaultValues && Util.pick(defaultValues, getValues());
      reset(resetValues as any ?? undefined);
    },
    [reset, getValues, JSON.stringify(defaultValues)]
  );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} onReset={onReset} {...props}>
      {children}
    </form>
  );
}
