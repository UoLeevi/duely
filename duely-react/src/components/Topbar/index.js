import React from 'react';
import './Topbar.css';

const Topbar = ({ layout: { section } = {}, className, children, ...props }) => {

  className = Array.from(new Set(((className ?? '') + ' topbar').split(' '))).join(' ');

  return (
    <header className={ className } data-layout={ section } { ...props }>
      { children }
    </header>
  );
};

export default Topbar;
