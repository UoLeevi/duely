import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './NavButton.css';

const NavButton = ({ link, text, icon, tag = 'button', minimize = false }) => {
  const { pathname } = useLocation();
  const active = pathname.startsWith(link?.to);
  const Element = tag;
  const Icon = icon;

  return (
    <Element className="nav-button surface color-s1n color-l1" data-minimized={ minimize } data-active={ active }>
      <NavLink className="pa-1" { ...link }>
        <div className="nav-button-icon background-bg bg-l3"><Icon/></div>
        <span className="nav-button-text f-1 f-b mt-1">{ text }</span>
      </NavLink>
    </Element>
  );
};

export default NavButton;
