import React, { useContext } from 'react';
import { ViewportContext } from './contexts/ViewportContext';
import DomainSwitch from './DomainSwitch';

const ViewRoot = () => {
  const { width } = useContext(ViewportContext);

  const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280
  };

  const classList = Object.entries(breakpoints)
    .filter(([k, v]) => v < width)
    .map(([k, v]) => k)
    .join(' ');

  return (
    <div id="v" className={classList}>
      <DomainSwitch />
    </div>
  );
};

export default ViewRoot;
