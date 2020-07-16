import React from 'react';
import useAnimatedTransition from 'hooks/useAnimatedTransition';

/**
 * Component is required to pass `onTransitionEnd` and `style` props to DOM tag element.
 */
const withAnimatedTransition = (Component, options) => (props, ref) => {
  props = useAnimatedTransition({ ...props, ref }, options)
  return (
    <Component { ...props } />
  );
};

export default withAnimatedTransition;
