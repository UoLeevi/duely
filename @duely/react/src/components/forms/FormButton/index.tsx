import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button, ButtonProps } from '../../buttons/Button';

type FormButtonProps<TFieldValues extends Record<string, any> = Record<string, any>> = {
  form: UseFormReturn<TFieldValues>;
  loading?: boolean;
  dense?: boolean;
} & Omit<ButtonProps, 'form'>;

export function FormButton<TFieldValues extends Record<string, any> = Record<string, any>>({
  form,
  type,
  disabled,
  loading,
  color,
  ...props
}: FormButtonProps<TFieldValues>) {
  disabled = !!(disabled || loading || !form.formState.isDirty);
  color = color ?? (type === 'reset' ? 'gray' : 'indigo');

  return <Button type={type} color={color} disabled={disabled} loading={loading} {...props} />;
}
