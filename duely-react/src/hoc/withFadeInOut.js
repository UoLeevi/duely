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

/*
  Component is required to pass `onTransitionEnd` and `style` props to DOM tag element
*/
const withFadeInOut = Component => ({ compare: value, skipCompare: skipValue, children, ...props }) => {

  const [state, setState] = useState(NO_TRANSITION);
  const previousSkipValue = usePrevious(skipValue);
  const skip = skipValue !== previousSkipValue;
  const previousValue = usePrevious(value);
  const changed = value !== previousValue;
  const previousChildren = usePrevious(children, { skip: state === TRANSITION_OUT || changed });
  const style = { ...props?.style, ...transitions['fade' /* this could be made to a prop */ ][state] };

  useLayoutEffect(() => {
    if (state !== TRANSITION_OUT && changed && !skip) {
      setState(TRANSITION_OUT);
    }
  }, [state, changed, skip]);

  const nextState = () => {
    if (skip) {
      setState(NO_TRANSITION);
    } else {
      setState({
        [TRANSITION_IN]: NO_TRANSITION,
        [TRANSITION_OUT]: TRANSITION_IN,
        [NO_TRANSITION]: NO_TRANSITION,
      }[state]);
    }
  };

  return (
    <Component onTransitionEnd={ nextState } { ...props } style={ style }>
      { state === TRANSITION_OUT
        ? previousChildren
        : children
      }
    </Component>
  );
};

export default withFadeInOut;
