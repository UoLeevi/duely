import React from 'react';
import { useBreakpoints } from './hooks';

const ViewRoot = ({ children }) => {
  const breakpoints = useBreakpoints();
  const className = Object.entries(breakpoints)
    .filter(([k, v]) => v)
    .map(([k, v]) => k)
    .join(' ');

  return (
    <div id="v" className={ className }>
      { children }
    </div>
  );
};

export default ViewRoot;
