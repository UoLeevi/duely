import React from 'react';
import useAnimatedTransition from 'hooks/useAnimatedTransition';

/**
 * Component is required to pass `onTransitionEnd` and `style` props to DOM tag element.
 */
const withAnimatedTransition = (Component, options) => props => {
  props = useAnimatedTransition(props, options)

  return (
    <Component { ...props } />
  );
};

export default withAnimatedTransition;
