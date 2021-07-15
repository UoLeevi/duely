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
  name,
  value,
  ...props
}: FormButtonProps) {
  const form = useFormContext();
  const { isDirty, isSubmitting } = form.useFormState();
  const isSubmitButton = !type || type === 'submit';
  loading ||= isSubmitButton && isSubmitting;
  disabled ||= isSubmitting || !isDirty;
  color = color ?? (type === 'reset' ? 'gray' : 'indigo');
  const registerProps = (name !== undefined && value !== undefined) ? form.register(name) : undefined;
  return <Button type={type} color={color} disabled={disabled} loading={loading} {...props} {...registerProps} />;
}
