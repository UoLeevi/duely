import React, { useEffect, useState } from 'react';
import './LoadingBar.css';

const LoadingBar = ({ loading = true, className, ...props }) => {
  loading = !!loading;
  const [playAnimation, setPlayAnimation] = useState(loading);
  className = 'w-100 ' + Array.from(new Set(((className ?? '') + ' loading-bar' + (loading ? ' loading' : '') + (playAnimation ? ' play-animation' : '')).split(' '))).join(' ');
  props = { className, ...props };

  useEffect(() => {
    if (loading === playAnimation) {
      return;
    }

    if (loading) {
      setPlayAnimation(loading);
      return;
    }

    const timeoutID = setTimeout(() => setPlayAnimation(loading), 110);
    return () => clearTimeout(timeoutID);
  }, [loading, playAnimation]);

  return (
    <div { ...props }></div>
  );
};

export default LoadingBar;
