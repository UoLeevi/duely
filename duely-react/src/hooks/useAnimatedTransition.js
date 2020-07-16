import React, { useState, useLayoutEffect, useEffect, useRef, isValidElement } from 'react';

const INITIAL = 'INITIAL';
const ENTERING = 'ENTERING';
const EXITING = 'EXITING';
const IDLE = 'IDLE';

// By delaying the enter transition we can sometimes avoid unnecessary 
// rerendering when props change repeteatedly.
const enteringDelayMs = 80;

const durationMs = 500;

const animationProperties = {
  fade: 'opacity'
}

const animationStyles = {
  fade: {
    [INITIAL]: { value: '0' },
    [ENTERING]: { value: '1' },
    [EXITING]: { value: '0', pointerEvents: 'none' },
    [IDLE]: { value: '1' }
  }
};

function createAnimationStyles(animation, state) {
  const property = animationProperties[animation];
  const { value, ...style } = animationStyles[animation][state];
  return { ...style, transition: `${property} ${durationMs}ms`, [property]: value };
}

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

  const current = ref.current;
  let element = undefined;
  let props = undefined;
  let domRef = useRef();

  if (current?.ref && 'current' in current.ref) {
    domRef = current.ref;
  }

  if (isValidElement(current)) {
    element = current;
    props = element.props;
  } else {
    props = current;
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

  useLayoutEffect(() => {
    const stateAfterTransition = state === EXITING
      ? INITIAL
      : !changed && state === ENTERING
        ? IDLE
        : undefined;

    if (!stateAfterTransition) {
      return;
    }

    console.assert(domRef.current, 'Ref pointing to DOM element is required. Remember to use `React.forwardRef` to pass ref to DOM element.');

    const domElement = domRef.current;
    const style = window.getComputedStyle(domElement);
    const property = animationProperties[animation];
    const value = animationStyles[animation][stateAfterTransition].value;

    if (style[property] === value) {
      setState(stateAfterTransition);
    } else {
      const listener = () => {
        domElement.removeEventListener('transitionend', listener);
        setState(stateAfterTransition);
      }

      domElement.addEventListener('transitionend', listener);
      return () => domElement.removeEventListener('transitionend', listener);
    }
  }, [state, changed, animation]);

  props = { ...props, ref: domRef, style: { ...props?.style, ...createAnimationStyles(animation, state) } };

  return element
    ? React.cloneElement(element, props)
    : props;
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
