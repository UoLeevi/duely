import React, { useLayoutEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './Choose.css';

const Choose = ({ children, index, justifyItems = 'center', alignItems = 'center' }) => {
  const ref = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(index);

  const components = React.Children.map(children, (child, i) => {
    let className = currentIndex === i
      ? 'visible' 
      : 'hidden';

    if (child.props.fit || child.props['data-fit']) {
      className += ' fit';
    }

    if (child.props.top || child.props['data-top']) {
      className += ' top';
    }

    if (child.props.right || child.props['data-right']) {
      className += ' right';
    }

    if (child.props.bottom || child.props['data-bottom']) {
      className += ' bottom';
    }

    if (child.props.left || child.props['data-left']) {
      className += ' left';
    }

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
    <div className='choose' style={{ justifyItems, alignItems }} ref={ ref }>
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
