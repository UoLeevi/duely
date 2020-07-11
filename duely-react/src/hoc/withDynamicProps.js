import React from 'react';

const withDynamicProps = (Component, getProps = props => props) => ({ ...props }) => {
  return (
    <Component { ...getProps(props) } />
  );
};

export default withDynamicProps;
