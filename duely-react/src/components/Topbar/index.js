import React from 'react';
import { createClassName } from 'utils';
import './Topbar.css';

const Topbar = React.forwardRef(({ className, children, ...props }, ref) => {
  className = createClassName(className, 'topbar');
  return (
    <header className={ className } { ...props } ref={ ref }>
      { children }
    </header>
  );
});

export default Topbar;
