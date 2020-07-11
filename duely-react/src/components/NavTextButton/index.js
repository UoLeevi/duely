import React from 'react';
import { NavLink, useMatch } from 'react-router-dom';
import './NavTextButton.css';

const NavTextButton = ({ link, text, tag = 'button', ...props }) => {
  const { to: path, caseSensitive, end } = link ?? {};
  const active = useMatch({ path, caseSensitive, end }) !== null;
  const Element = tag;
  const Wrapper = link
    ? ({ children }) => (<NavLink { ...link }>{ children }</NavLink>)
    : null;

  return (
    <Element className="nav-text-button surface color-s1n color-l1" data-active={ active } { ...props }>
      <Wrapper>
        <span className="nav-text-button-text f-1 f-b pa-1">{ text }</span>
      </Wrapper>
    </Element>
  );
};

export default NavTextButton;
