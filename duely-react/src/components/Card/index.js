import React from 'react';
import { createClassName } from 'utils';

const Card = React.forwardRef(({ children, className, ...props }, ref) => {

  className = createClassName(className, 'card radius-1 panel pa-4 relative');

  return (
    <div className={ className } data-bg="l10" { ...props } ref={ ref }>
      { children }
    </div>
  );
});

export default Card;
