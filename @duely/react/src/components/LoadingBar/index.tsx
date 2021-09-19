import React, { useEffect, useState } from 'react';
import { createClassName } from '@duely/util';

type LoadingBarProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  loading?: boolean
};

export function LoadingBar ({ loading = true, className, ...props }: LoadingBarProps) {
  loading = !!loading;
  const [playAnimation, setPlayAnimation] = useState(loading);
  const progressClassName = createClassName(
    'w-full h-full transition-opacity duration-100 bg-indigo-300 bg-mask-x-transparent',
    loading ? 'opacity-100 delay-100' : 'opacity-0',
    playAnimation && 'animate-progress'
  );

  className = createClassName('relative overflow-hidden w-full h-1 bg-mask-x-transparent', className);

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
    <div className={className} { ...props }>
      <div className={ progressClassName }></div>
    </div>
  );
}
