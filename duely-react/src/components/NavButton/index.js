import React from 'react';
import Link from 'components/Link';
import useAppState from 'hooks/useAppState';
import { matchPath } from 'routes';
import { createClassName } from 'utils';
import './NavButton.css';

const NavButton = ({ link, text, icon, tag = 'button', minimize = false, className, ...props }) => {
  const [state, ] = useAppState();
  const { pathname } = state.context.history.location;
  const { to: path, end } = link ?? {};
  const active = matchPath({ path, end }, pathname) !== false;
  const Element = tag;
  const Icon = icon;

  className = createClassName(className, 'nav-button surface color-s1n color-l1');

  return (
    <Element className={ className } data-minimized={ minimize } data-active={ active } { ...props }>
      <Link className="pa-1" { ...link }>
        <div className="nav-button-icon" data-bg="l1"><Icon /></div>
        <span className="nav-button-text f-1 f-b mt-1">{ text }</span>
      </Link>
    </Element>
  );
};

export default NavButton;
