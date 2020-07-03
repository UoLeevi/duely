import React from 'react';
import NavButton from 'components/NavButton';
import './Nav.css';

const Nav = ({ items = [], horizontal }) => {
  
  const menuItems = items.map(({ link, text, icon }) => {
    return (
      <NavButton tag="li" key={ link.to } text={ text } link={ link } icon={ icon } />
    );
  });

  return (
    <nav className={ 'nav ' + (horizontal ? 'h' : 'v') }>
      <ul>
        { menuItems }
      </ul>
    </nav>
  );
};

export default Nav;
