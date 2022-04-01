import React from 'react';
import { Button, ButtonProps } from '../../buttons/Button';
import { useFormContext } from '../Form';

type FormButtonProps = {
  loading?: boolean;
  dense?: boolean;
  'initially-enabled'?: boolean;
} & Omit<ButtonProps, 'form'>;

export const FormButton = React.forwardRef(function (
  {
    type,
    disabled,
    loading,
    color,
    name,
    value,
    'initially-enabled': initiallyEnabled,
    ...props
  }: FormButtonProps,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  const form = useFormContext();
  const { isDirty, isSubmitting } = form.useFormState();
  const isSubmitButton = !type || type === 'submit';
  loading ||= isSubmitButton && isSubmitting;
  disabled ||= isSubmitting || (!initiallyEnabled && !isDirty);
  color = color ?? (type === 'reset' ? 'gray' : 'indigo');
  const registerProps = name !== undefined && value !== undefined ? form.register(name) : undefined;
  return (
    <Button
      form={form.id}
      type={type}
      color={color}
      disabled={disabled}
      loading={loading}
      {...props}
      {...registerProps}
      ref={ref}
    />
  );
});
