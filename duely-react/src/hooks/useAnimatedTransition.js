import React, { useState, useEffect, useRef, isValidElement } from 'react';

const TRANSITION_ENTER = 'TRANSITION_ENTER';
const TRANSITION_IN = 'TRANSITION_IN';
const TRANSITION_OUT = 'TRANSITION_OUT';
const NO_TRANSITION = 'NO_TRANSITION';

const animations = {
  fade: {
    [TRANSITION_ENTER]: { transition: 'opacity 140ms', opacity: 0 },
    [TRANSITION_IN]: { transition: 'opacity 140ms', opacity: 1 },
    [TRANSITION_OUT]: { transition: 'opacity 140ms', opacity: 0, pointerEvents: 'none' },
    [NO_TRANSITION]: { transition: 'opacity 140ms', opacity: 1 }
  }
};

const cache = new WeakMap();

const defaultOptions = {
  animation: 'fade',
  shouldTransition: (previous, next) => {
    if (isValidElement(previous ?? next)) {
      // arguments are elements

      if (previous?.type !== next?.type) {
        // elements are different types
        return true;
      }

      previous = previous?.props;
      next = next?.props;
    }

    if (previous && next) {
      // compare props
      return Object.keys(previous).length !== Object.keys(next).length ||
        Object.keys(previous).some(key => !Object.is(previous[key], next[key]));
    }

    return previous || next;
  }
};

/**
 * TODO: Refactor later. Works currently but logic is very convoluted.
 */
export default function useAnimatedTransition(next, options) {
  const { shouldTransition, animation } = { ...defaultOptions, ...options };
  const [state, setState] = useState(TRANSITION_ENTER);
  const ref = useRef();
  const previous = ref.current;

  function getNextState() {
    if (state === TRANSITION_ENTER) {
      return next
        ? TRANSITION_IN
        : TRANSITION_ENTER;
    }

    const changed = shouldTransition(previous, next);

    if (changed) {
      return previous
        ? TRANSITION_OUT
        : TRANSITION_IN;
    }

    if (!previous && !next) {
      return TRANSITION_ENTER;
    }

    return NO_TRANSITION;
  }

  const nextState = getNextState();

  useEffect(() => {
    if (state !== nextState) {
      setState(nextState);
    }
  }, [next, state, nextState]);

  if (state === TRANSITION_OUT) {
    return cache.get(ref.current);
  }

  if (nextState === TRANSITION_OUT) {
    const element = isValidElement(previous) && previous;
    const props = element?.props ?? previous;
    const style = { ...props?.style, ...animations[animation][nextState] };

    const onTransitionEnd = e => {
      e.stopPropagation();
      ref.current = null;
      setState(TRANSITION_IN);
    };

    const result = element
      ? React.cloneElement(element, { onTransitionEnd, style })
      : { onTransitionEnd, ...props, style };

    cache.set(previous, result);
    return result;

  } else {
    ref.current = next;
    const element = isValidElement(next) && next;
    const props = element?.props ?? next;
    const style = { ...props?.style, ...animations[animation][state] };

    const onTransitionEnd = e => {
      e.stopPropagation();
      setState(NO_TRANSITION);
    };

    return element
      ? React.cloneElement(element, { onTransitionEnd, style })
      : { onTransitionEnd, ...props, style };
  }
}
