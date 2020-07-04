import React from 'react';
import NavButton from 'components/NavButton';
import './Nav.css';

const Nav = ({ items = [], layout: { orientation, section } = { orientation: 'vertical' } }) => {
  
  const menuItems = items.map(({ link, text, icon }) => {
    return (
      <NavButton tag="li" key={ link.to } text={ text } link={ link } icon={ icon } />
    );
  });

  let className = 'nav';

  switch (orientation) {
    case 'horizontal':
      className += ' h';
      break;

    case 'vertical':
      className += ' v';
      break;

    default:
      break;
  }

  return (
    <nav className={ className } data-layout={ section }>
      <ul>
        { menuItems }
      </ul>
    </nav>
  );
};

export default Nav;
