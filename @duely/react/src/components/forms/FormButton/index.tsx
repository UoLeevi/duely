import React from 'react';
import { Button, ButtonProps } from '../../buttons/Button';
import { useFormContext2 } from '../Form';

type FormButtonProps<TFieldValues extends Record<string, any> = Record<string, any>> = {
  loading?: boolean;
  dense?: boolean;
} & Omit<ButtonProps, 'form'>;

export function FormButton<TFieldValues extends Record<string, any> = Record<string, any>>({
  type,
  disabled,
  loading,
  color,
  ...props
}: FormButtonProps<TFieldValues>) {
  const form = useFormContext2();
  disabled = !!(disabled || loading || !form.formState.isDirty);
  color = color ?? (type === 'reset' ? 'gray' : 'indigo');

  return <Button type={type} color={color} disabled={disabled} loading={loading} {...props} />;
}
