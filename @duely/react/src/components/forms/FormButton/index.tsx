import React from 'react';
import { Button, ButtonProps } from '../../buttons/Button';
import { useFormContext2 } from '../Form';
import { FormState } from '../Form/useForm2';

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
  const { useWatch } = useFormContext2();
  const [isDirty] = useWatch(FormState.isDirty);
  disabled = !!(disabled || loading || !isDirty);
  color = color ?? (type === 'reset' ? 'gray' : 'indigo');

  return <Button type={type} color={color} disabled={disabled} loading={loading} {...props} />;
}
