import React from 'react';
import { Button, ButtonProps } from '../../buttons/Button';
import { useFormContext } from '../Form';

type FormButtonProps = {
  loading?: boolean;
  dense?: boolean;
} & Omit<ButtonProps, 'form'>;

export function FormButton({
  type,
  disabled,
  loading,
  color,
  ...props
}: FormButtonProps) {
  const form = useFormContext();
  const { isDirty } = form.useFormState();
  disabled = !!(disabled || loading || !isDirty);
  color = color ?? (type === 'reset' ? 'gray' : 'indigo');

  return <Button type={type} color={color} disabled={disabled} loading={loading} {...props} />;
}
