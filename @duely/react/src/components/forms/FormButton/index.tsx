import React from 'react';
import { Button, ButtonProps } from '../../buttons/Button';
import { useFormContext } from '../Form';
import { FormState } from '../hooks';

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
  const { useFormWatch } = useFormContext();
  const [isDirty] = useFormWatch(FormState.isDirty);
  disabled = !!(disabled || loading || !isDirty);
  color = color ?? (type === 'reset' ? 'gray' : 'indigo');

  return <Button type={type} color={color} disabled={disabled} loading={loading} {...props} />;
}
