import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { ButtonBase, ButtonBaseProps } from './ButtonBase';

type LinkButtonProps = LinkProps & ButtonBaseProps;

export const LinkButton = React.forwardRef(function (
  props: LinkButtonProps,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  return <ButtonBase render={Link} {...props} ref={ref} />;
});
