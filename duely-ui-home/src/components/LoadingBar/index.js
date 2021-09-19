import React, { useEffect, useState } from 'react';
import { Util } from '@duely/react';

const LoadingBar = ({ loading = true, className, ...props }) => {
  loading = !!loading;
  const [playAnimation, setPlayAnimation] = useState(loading);
  const progressClassName = createClassName(
    'w-full h-full transition-opacity duration-100 bg-gradient-to-r from-blue-400 via-teal-500 to-purple-500 bg-mask-x-transparent', 
    loading ? 'opacity-100 delay-100' : 'opacity-0',
    playAnimation && 'animate-progress'
    );
    
  className = createClassName('relative overflow-hidden w-full h-1 bg-mask-x-transparent', className);
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
    <div { ...props }>
      <div className={ progressClassName }></div>
    </div>
  );
};

export default LoadingBar;
