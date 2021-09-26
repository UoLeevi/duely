import React from 'react';

type FormLabelProps<TFieldName extends string | undefined> = {
  htmlFor?: TFieldName;
} & (TFieldName extends string
  ? Omit<React.HTMLAttributes<HTMLLabelElement>, 'htmlFor'>
  : React.HTMLAttributes<HTMLSpanElement>);

export function FormLabel<TFieldName extends string | undefined>({
  className,
  ...props
}: FormLabelProps<TFieldName>) {
  const Component = typeof props.htmlFor === 'string' ? 'label' : 'span';

  return (
    <Component
      className={`pl-px font-medium text-gray-700 dark:text-gray-300 ${className}`}
      {...props}
    />
  );
}
