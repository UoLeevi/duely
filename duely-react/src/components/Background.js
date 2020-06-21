import React from 'react';
import './Background.css';

const Background = ({ children, fullscreen }) => {
  const className = 'background' + (fullscreen ? ' fullscreen' : '');

  return (
    <div className={ className }>
      { children }
    </div>
  );
};

export default Background;
