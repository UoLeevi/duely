import React from 'react';
import Link from 'components/Link';
import useAppState from 'hooks/useAppState';
import { matchPath } from 'routes';
import './NavTextButton.css';

const NavTextButton = ({ link, text, tag = 'button', className = '', ...props }) => {
  const [state, ] = useAppState();
  const { pathname } = state.context.history.location;
  const { to: path, end } = link ?? {};
  const active = matchPath({ path, end }, pathname) !== null;
  const Element = tag;
  const Wrapper = link
    ? ({ children }) => (<Link { ...link }>{ children }</Link>)
    : null;

  className = Array.from(new Set(((className ?? '') + ' nav-text-button surface color-s1n color-l1').split(' '))).join(' ');

  return (
    <Element className={ className } data-active={ active } { ...props }>
      <Wrapper>
        <span className="nav-text-button-text f-1 f-b pa-1">{ text }</span>
      </Wrapper>
    </Element>
  );
};

export default NavTextButton;
