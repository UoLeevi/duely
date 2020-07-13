import React, { useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './Choose.css';

const Choose = ({ children, index, placeItems = 'center', ...props }) => {
  const ref = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(index);

  const components = React.Children.map(children, (child, i) => {
    let className = currentIndex === i
      ? 'visible' 
      : 'hidden';

    return (
      <div key={ i } className={ className }>
        { child }
      </div>
    );
  });

  useLayoutEffect(() => {
    if (index === currentIndex) {
      return;
    }
  
    const hideEl = ref.current.children[currentIndex];

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
  }, [index, currentIndex, components.length]);

  return (
    <div className='choose' style={{ placeItems }} { ...props } ref={ ref }>
      { components }
    </div>
  );
};

Choose.propTypes = {
  index: PropTypes.number.isRequired,
  justifyItems: PropTypes.oneOf(['center', 'start', 'end']),
  alignItems: PropTypes.oneOf(['center', 'start', 'end'])
};

export default Choose;
