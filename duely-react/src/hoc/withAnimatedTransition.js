import React, { useState, useLayoutEffect } from 'react';
import usePrevious from 'hooks/usePrevious';

const TRANSITION_IN = 'TRANSITION_IN'
const TRANSITION_OUT = 'TRANSITION_OUT'
const NO_TRANSITION = 'NO_TRANSITION'

const animations = {
  fade: {
    [TRANSITION_IN]: { transition: 'opacity 140ms', opacity: 1 },
    [TRANSITION_OUT]: { transition: 'opacity 140ms', opacity: 0, pointerEvents: 'none' },
    [NO_TRANSITION]: { transition: 'opacity 140ms', opacity: 1 },
  }
};

const defaultOptions = {
  animation: 'fade',
  shouldTransition: (prevProps, props) => true
};

/**
 * Component is required to pass `onTransitionEnd` and `style` props to DOM tag element
 */
const withAnimatedTransition = (Component, options = defaultOptions) => props => {
  const { animation, shouldTransition } = { ...defaultOptions, ...options };
  const [state, setState] = useState(NO_TRANSITION);
  const prevProps = usePrevious(props);
  const changed = state === TRANSITION_OUT ? true : shouldTransition(prevProps, props);
  const transitioningProps = usePrevious(props, { skip: changed });
  const renderedProps = changed ? transitioningProps : props
  const style = { ...renderedProps?.style, ...animations[animation][state] };

  useLayoutEffect(() => {
    if (state !== TRANSITION_OUT && changed) {
      setState(TRANSITION_OUT);
    }
  }, [state, changed]);

  const nextState = () => {
    switch (state) {

      case TRANSITION_OUT:
        setState(TRANSITION_IN);
        break;

      case TRANSITION_IN:
        setState(NO_TRANSITION);
        break;

      default:
        break;
    }
  };

  return (
    <Component onTransitionEnd={ nextState } { ...renderedProps } style={ style } />
  );
};

export default withAnimatedTransition;
