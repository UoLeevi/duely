import React from 'react';

const withProps = (Component, bindProps) => ({ ...props }) => {
  if (typeof bindProps === 'function') {
    return (
      <Component { ...bindProps(props) } />
    );
  } else {
    return (
      <Component { ...bindProps } { ...props } />
    );
  }
};

export default withProps;
