import React from 'react';
import { ButtonBase, ButtonBaseProps } from './ButtonBase';

export type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> &
  ButtonBaseProps;

export const Button = React.forwardRef(function (
  props: ButtonProps,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  return <ButtonBase render="button" {...props} ref={ref} />;
});
