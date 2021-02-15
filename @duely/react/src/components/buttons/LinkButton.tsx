import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { ButtonBase, ButtonBaseProps } from './ButtonBase';

type LinkButtonProps = LinkProps & ButtonBaseProps;

export function LinkButton(props: LinkButtonProps) {
  return <ButtonBase render={Link} {...props} />;
}
