import React, { useEffect, useState } from 'react';
import { Util } from '../../util';

export function LoadingBar ({ loading = true, className, ...props }) {
  loading = !!loading;
  const [playAnimation, setPlayAnimation] = useState(loading);
  const progressClassName = Util.createClassName(
    'w-full h-full transition-opacity duration-100 bg-indigo-300 bg-mask-x-transparent',
    loading ? 'opacity-100 delay-100' : 'opacity-0',
    playAnimation && 'animate-progress'
  );

  className = Util.createClassName('relative overflow-hidden w-full h-1 bg-mask-x-transparent', className);
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
}
