import React, { useState, useLayoutEffect, useEffect, useRef, isValidElement } from 'react';

const INITIAL = 'INITIAL';
const ENTERING = 'ENTERING';
const EXITING = 'EXITING';
const IDLE = 'IDLE';

// By delaying the enter transition we can sometimes avoid unnecessary 
// rerendering when props change repeteatedly.
const enteringDelayMs = 80;

const durationMs = 200;

const animations = {
  fade: {
    [INITIAL]: { transition: `opacity ${durationMs}ms`, opacity: 0 },
    [ENTERING]: { transition: `opacity ${durationMs}ms`, opacity: 1 },
    [EXITING]: { transition: `opacity ${durationMs}ms`, opacity: 0, pointerEvents: 'none' },
    [IDLE]: { transition: `opacity ${durationMs}ms`, opacity: 1 }
  }
};

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

export default function useAnimatedTransition(next, options) {
  const { shouldTransition, animation } = { ...defaultOptions, ...options };
  const [state, setState] = useState(INITIAL);
  const ref = useRef();
  const previous = ref.current;

  const changed = [ENTERING, IDLE].includes(state) && (!previous || !next || shouldTransition(previous, next));

  if (!changed && state !== EXITING && next) {
    ref.current = next;
  }

  useEffect(() => {
    if (state === INITIAL && next) {
      const startEnteringTimeout = setTimeout(() => setState(ENTERING), enteringDelayMs);
      return () => clearTimeout(startEnteringTimeout);
    }
  }, [next, state]);

  useLayoutEffect(() => {
    if (changed && previous) {
      setState(EXITING);
    }
  }, [previous, changed]);

  const current = ref.current;
  const element = isValidElement(current) && current;
  const props = element?.props ?? current;
  const animationProps = { style: { ...props?.style, ...animations[animation][state] } };

  if (state === EXITING) {
    // TODO: check current style property value
    animationProps.onTransitionEnd = e => {
      ref.current = undefined;
      setState(INITIAL);
    };
  } else if (!changed && state === ENTERING) {
    // TODO: check current style property value
    animationProps.onTransitionEnd = e => {
      setState(IDLE);
    };
  }

  return element
    ? React.cloneElement(element, animationProps)
    : { ...props, ...animationProps };
}

// # State matrix
// p = previous
// n = next
// @ = ignore
// x = true / set
// / = some is true / set
//   = false / undefined
//
// case no.   0 1 2 3 4 5 
//           | |@|p|p|p|p|
//           | |n|n|n|@|n|
// - changed |@|@| | |x|@|
// ## render +-+-+-+-+-+-+
// INITIAL   |x|x| | | | |
// ENTERING  | | |x| |/| |
// IDLE      | | | |x|/| |
// EXITING   | | | | | |x|
// - current |@|n|n|n|p|p|
//           +-+-+-+-+-+-+
//              V     V   
// ## effect +-+-+-+-+-+-+
// INITIAL   |@| |@|@| |@|
// ENTERING  |@|x|@|@| |@|
// IDLE      |@| |@|@| |@|
// EXITING   |@| |@|@|x|@|
//           +-+-+-+-+-+-+
//                V     V 
// ## tr.end +-+-+-+-+-+-+
// - current |@|@|@|@|@| |
// INITIAL   |@|@| |@|@|x|
// ENTERING  |@|@| |@|@| |
// IDLE      |@|@|x|@|@| |
// EXITING   |@|@| |@|@| |
// next case  0 2 3 3 5 0 
