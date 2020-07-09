import React, { useState, useLayoutEffect } from 'react';
import usePrevious from 'hooks/usePrevious';

const TRANSITION_IN = 'TRANSITION_IN'
const TRANSITION_OUT = 'TRANSITION_OUT'
const NO_TRANSITION = 'NO_TRANSITION'

const transitions = {
  fade: {
    [TRANSITION_IN]: { transition: 'opacity 140ms', opacity: 1 },
    [TRANSITION_OUT]: { transition: 'opacity 140ms', opacity: 0, pointerEvents: 'none' },
    [NO_TRANSITION]: { opacity: 1 },
  }
};

const TransitionElement = ({ tag = 'div', compare: value, transition = 'fade', children, ...props }) => {
  const Component = tag;
  const [state, setState] = useState(NO_TRANSITION);
  const previousValue = usePrevious(value);
  const changed = value !== previousValue;
  const previousChildren = usePrevious(children, { skip: state === TRANSITION_OUT || changed });
  const style = transitions[transition][state];

  useLayoutEffect(() => {
    if (state !== TRANSITION_OUT && changed) {
      setState(TRANSITION_OUT);
    }
  }, [state, changed]);

  switch (state) {
    case TRANSITION_IN:
      return (
        <Component style={ style } onTransitionEnd={ () => setState(NO_TRANSITION) } { ...props }>
          { children }
        </Component>
      );

    case TRANSITION_OUT:
      return (
        <Component style={ style } onTransitionEnd={ () => setState(TRANSITION_IN) } { ...props }>
          { previousChildren }
        </Component>
      );

    case NO_TRANSITION:
      return (
        <Component style={ style } { ...props }>
          { children }
        </Component>
      );

    default:
      // impossible
      break;
  }
};

export default TransitionElement;
