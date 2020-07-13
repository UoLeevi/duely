import React from 'react';
import { NavLink, useMatch } from 'react-router-dom';
import './NavButton.css';

const NavButton = ({ link, text, icon, tag = 'button', minimize = false, className, ...props }) => {
  const { to: path, caseSensitive, end } = link ?? {};
  const active = useMatch({ path, caseSensitive, end }) !== null;
  const Element = tag;
  const Icon = icon;
  className = Array.from(new Set(((className ?? '') + ' nav-button surface color-s1n color-l1').split(' '))).join(' ');

  return (
    <Element className={ className } data-minimized={ minimize } data-active={ active } { ...props }>
      <NavLink className="pa-1" { ...link }>
        <div className="nav-button-icon background-bg bg-l3"><Icon /></div>
        <span className="nav-button-text f-1 f-b mt-1">{ text }</span>
      </NavLink>
    </Element>
  );
};

export default NavButton;
