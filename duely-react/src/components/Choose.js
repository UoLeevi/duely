import React, { useLayoutEffect, useRef } from 'react';
import { usePrevious } from '../hooks';
import './Choose.css';

const Choose = ({ children, index }) => {
  const previousIndex = usePrevious(index);
  const ref = useRef(null);
  const components = React.Children.map(children, (child, i) => {
    let className = previousIndex === i
      ? 'visible' 
      : 'hidden';

    if (child.props.fit) {
      className += ' fit';
    }

    return (
      <div key={ i } className={ className }>
        { child }
      </div>
    );
  });

  useLayoutEffect(() => {
    if (previousIndex === undefined || index === previousIndex) {
      return;
    }

    const hideEl = ref.current.children[previousIndex];

    function show(e) {
      console.log(e);
      hideEl.removeEventListener('transitionend', show);
      const showEl = ref.current.children[index];
      showEl.classList.add('show');
    }

    hideEl.classList.add('hide');
    hideEl.addEventListener('transitionend', show);

    return () => hideEl.removeEventListener('transitionend', show);
  }, [index, previousIndex, components.length]);

  return (
    <div className='choose' ref={ ref }>
      { components }
    </div>
  );
};

export default Choose;
