import React, { useState, useLayoutEffect, useRef, isValidElement } from 'react';

const ENTER = 'enter';
const EXIT = 'exit';
const IDLE = 'idle';

const animations = {
  fade: {
    [ENTER]: [[{ opacity: '0' }, { opacity: '1' }], { duration: 200, fill: 'forwards' }],
    [EXIT]: [[{ opacity: '1', pointerEvents: 'none' }, { opacity: '0', pointerEvents: 'none' }], { duration: 200, fill: 'forwards' }]
  }
};

const defaultOptions = {
  animations: animations['fade'],
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
  const { shouldTransition, animations } = { ...defaultOptions, ...options };
  const [,setForceUpdateCount] = useState(0);
  const ref = useRef({ state: ENTER, previous: undefined, animation: undefined });
  const { previous, animation } = ref.current;
  const changed = ref.current.state !== EXIT && (!previous || !next || shouldTransition(previous, next));

  if (changed && previous) {
    ref.current.state = EXIT;
  }

  const state = ref.current.state;

  if ((!ref.current.previous || (!changed && state !== EXIT)) && next) {
    ref.current.previous = next;
  }

  const current = ref.current.previous;
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

  useLayoutEffect(() => {
    if (current && (animation?.id !== state || animation.playState === 'paused')) {
      const [keyframes, options] = animations[state] ?? [];

      if (keyframes) {
        let animation = ref.current.animation;

        if (animation?.playState === 'paused') {
          // TODO: continue or replace animation
        }

        const domElement = domRef.current;
        animation = ref.current.animation = domElement.animate(keyframes, options);
        animation.id = state;

        animation.onfinish = () => {
          ref.current.state = state === EXIT ? ENTER : IDLE;

          if (state === EXIT) {
            ref.current.previous = undefined;
            setForceUpdateCount(s => s + 1);
          }
        };

        return () => {
          if (animation.playState === 'running') {
            animation.pause();
          }
        }
      }
    }
  }, [animations, current, state, animation]);

  props = { ...props, style: { ...props?.style, ...animations[state]?.[0]?.[0] }, ref: domRef };

  return element
    ? React.cloneElement(element, props)
    : props;
}
