import React from 'react';
import useAnimatedTransitionProps from 'hooks/useAnimatedTransitionProps';

/**
 * Component is required to pass `onTransitionEnd` and `style` props to DOM tag element.
 */
const withAnimatedTransition = (Component, options) => props => {
  props = useAnimatedTransitionProps(props, options)

  return (
    <Component { ...props } />
  );
};

export default withAnimatedTransition;
