import React from 'react';
import useAnimatedTransitionProps from 'hooks/useAnimatedTransitionProps';

/**
 * Component of the child element is required to pass `onTransitionEnd` and `style` props to DOM tag element.
 */
const AnimatedTransition = ({ animation = 'fade', shouldTransition, children }) => {
  const props = useAnimatedTransitionProps(children.props, { animation, shouldTransition });
  return React.cloneElement(children, props);
};

export default AnimatedTransition;
