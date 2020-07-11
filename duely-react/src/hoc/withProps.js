import React from 'react';

const withProps = (Component, bindProps) => ({ ...props }) => {
  return (
    <Component { ...bindProps } { ...props } />
  );
};

export default withProps;
