import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './NavTextButton.css';

const NavTextButton = ({ link, text, tag = 'button' }) => {
  const { pathname } = useLocation();
  const active = pathname.startsWith(link?.to);
  const Element = tag;
  const Wrapper = link
    ? ({ children }) => (<NavLink { ...link }>{ children }</NavLink>)
    : null;

  return (
    <Element className="nav-text-button surface color-s1n color-l1" data-active={ active }>
      <Wrapper>
        <span className="nav-text-button-text f-1 f-b pa-1">{ text }</span>
      </Wrapper>
    </Element>
  );
};

export default NavTextButton;
