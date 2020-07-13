import { isValidElement } from 'react';
import useAnimatedTransition from 'hooks/useAnimatedTransition';

/**
 * Component of the child element is required to pass `onTransitionEnd` and `style` props to DOM tag element.
 */ 
const AnimatedTransition = ({ children: element, ...options }) => {
  element = useAnimatedTransition(element, options);
  return isValidElement(element) && element;
};

export default AnimatedTransition;
