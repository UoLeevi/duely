import React from 'react';
import { useLocation } from 'react-router-dom';

const withLocation = Component => ({ ...props }) => {
  const location = useLocation();
  return (
    <Component location={ location } { ...props } />
  );
};

export default withLocation;
