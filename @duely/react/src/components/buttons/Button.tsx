import React from 'react';
import { ButtonBase, ButtonBaseProps } from './ButtonBase';

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> &
  ButtonBaseProps;

export function Button(props: ButtonProps) {
  return <ButtonBase render="button" {...props} />;
}
