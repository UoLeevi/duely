import { useState, useLayoutEffect } from 'react';
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
  shouldTransition: (prevProps, props) =>
    Object.keys(prevProps).length !== Object.keys(props).length ||
    Object.keys(prevProps).some(key => prevProps[key] !== props[key])
};

export default function useAnimatedTransitionProps(props, options) {
  const {
    shouldTransition = defaultOptions.shouldTransition,
    animation = defaultOptions.animation
  } = options;

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

  return { onTransitionEnd: nextState, ...renderedProps, style };
}
