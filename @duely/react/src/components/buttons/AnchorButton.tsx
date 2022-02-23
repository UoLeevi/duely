import React from 'react';
import { ButtonBase, ButtonBaseProps } from './ButtonBase';

type AnchorButtonProps = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> &
  ButtonBaseProps;

export const AnchorButton = React.forwardRef(function (
  props: AnchorButtonProps,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  return <ButtonBase render="a" {...props} ref={ref} />;
});
