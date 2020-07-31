import React from 'react';
import './Chip.css';

const Chip = ({ children, color, style, className, ...props }) => {

  className = Array.from(new Set(((className ?? '') + ' chip f-1 f-b').split(' '))).join(' ');

  style = {
    'backgroundColor': `var(--color-${color}-l3)`,
    'color': `var(--color-${color})`,
    ...style
  };

  return (
    <span className={ className } style={ style } { ...props }>
      { children }
    </span>
  );
};

export default Chip;
