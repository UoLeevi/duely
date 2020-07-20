import React, { useLayoutEffect, useRef, useState } from 'react';
import './Choose.css';

const Choose = React.forwardRef(({ children, index, placeItems = 'center', className, ...props }, ref) => {
  const defaultRef = useRef();
  ref = ref ?? defaultRef;

  const childrenRef = useRef(React.Children.toArray(children));
  const [currentIndex, setCurrentIndex] = useState(index);
  const renderedChildren = [];

  const components = React.Children.map(children, (element, i) => {
    if (!element && index !== currentIndex) {
      element = childrenRef.current[i];
    }

    if (!element) {
      renderedChildren.push(element);
      return element;
    }

    const className = currentIndex === i ? 'visible' : 'hidden';
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

  useLayoutEffect(() => {
    if (index === currentIndex) {
      return;
    }
  
    const renderedChild = renderedChildren[currentIndex];
    const actualIndex = renderedChildren.filter(e => e).indexOf(renderedChild);
    const hideEl = ref.current.children[actualIndex];

    if (!hideEl) {
      setCurrentIndex(index);
      return;
    }

    function show(e) {
      hideEl.removeEventListener('transitionend', show);
      hideEl.classList.remove('hide');
      setCurrentIndex(index);
    }

    hideEl.addEventListener('transitionend', show);
    hideEl.classList.add('hide');

    return () => {
      hideEl.removeEventListener('transitionend', show);
      hideEl.classList.remove('hide');
    };
  }, [index, currentIndex, components.length, renderedChildren, ref]);

  className = Array.from(new Set(((className ?? '') + ' choose').split(' '))).join(' ');

  return (
    <div className={ className } style={{ placeItems }} { ...props } ref={ ref }>
      { components }
    </div>
  );
});

export default Choose;
