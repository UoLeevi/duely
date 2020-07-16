import React from 'react';
import './Topbar.css';

const Topbar = React.forwardRef(({ className, children, ...props }, ref) => {

  className = Array.from(new Set(((className ?? '') + ' topbar').split(' '))).join(' ');
  return (
    <header className={ className } { ...props } ref={ ref }>
      { children }
    </header>
  );
});

export default Topbar;
