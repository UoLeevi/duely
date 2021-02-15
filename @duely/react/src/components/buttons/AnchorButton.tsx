import React from 'react';
import { ButtonBase, ButtonBaseProps } from './ButtonBase';

type AnchorButtonProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> &
  ButtonBaseProps;

export function AnchorButton(props: AnchorButtonProps) {
  return <ButtonBase render="a" {...props} />;
}
