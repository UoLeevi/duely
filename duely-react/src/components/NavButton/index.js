import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavButton.css';

const NavButton = ({ link, text, icon, tag = 'button' }) => {
  const Element = tag;
  const Icon = icon;
  const Asdf = link
    ? ({ children }) => (<NavLink { ...link }>{ children }</NavLink>)
    : null;

  return (
    <Element className="nav-button">
      <Asdf>
        <div className="nav-button-icon"><Icon/></div>
        <span className="nav-button-text">{ text }</span>
      </Asdf>
    </Element>
  );
};

export default NavButton;
