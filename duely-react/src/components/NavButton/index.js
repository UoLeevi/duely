import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavButton.css';

const NavButton = ({ link, text, icon, tag = 'button' }) => {
  const Element = tag;
  const Icon = icon;
  const Wrapper = link
    ? ({ children }) => (<NavLink { ...link }>{ children }</NavLink>)
    : null;

  return (
    <Element className="nav-button surface color-l2">
      <Wrapper>
        <div className="nav-button-icon surface-bg bg-sn1 bg-l4"><Icon/></div>
        <span className="nav-button-text f-1 f-b mt-1">{ text }</span>
      </Wrapper>
    </Element>
  );
};

export default NavButton;
