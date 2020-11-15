import React, { useEffect, useState } from 'react';
import { CgSpinner } from 'react-icons/cg';
import { Util } from '../../util';

export function LoadingSpinner({ className, loading }) {
  loading = !!loading;

  const [playAnimation, setPlayAnimation] = useState(loading);

  className = Util.createClassName(
    'transition-opacity duration-150',
    loading ? 'opacity-100 duration-100' : 'opacity-0',
    playAnimation && 'animate-spin',
    className);

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
    <CgSpinner className={className} />
  );
}
