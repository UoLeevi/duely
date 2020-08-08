import React, { useRef } from 'react';
import { createClassName } from 'utils';
import './Choose.css';

const Choose = React.forwardRef(({ children, index, placeItems = 'center', className, ...props }, ref) => {
  const defaultRef = useRef();
  ref = ref ?? defaultRef;

  const childrenRef = useRef(React.Children.toArray(children));
  const renderedChildren = [];

  children = React.Children.map(children, (element, i) => {
    if (!element) {
      element = childrenRef.current[i];
    }

    if (!element) {
      renderedChildren.push(element);
      return element;
    }

    const className = index === i ? 'visible' : 'hidden';
    const modifier = element.props?.['data-choose'];
    const style = {};

    if (modifier) {
      if (modifier === 'fit') {
        // handled in css file
      } else {
        style.placeSelf = modifier;
      }
    }

    renderedChildren.push(element);
    return (
      <div key={ i } className={ className } style={ style }>
        { element }
      </div>
    );
  });

  childrenRef.current = renderedChildren;
  className = createClassName(className, 'choose');

  return (
    <div className={ className } style={{ placeItems }} { ...props } ref={ ref }>
      { children }
    </div>
  );
});

export default Choose;
