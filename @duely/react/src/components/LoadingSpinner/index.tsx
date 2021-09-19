import React, { useEffect, useState } from 'react';
import { createClassName } from '@duely/util';

type LoadingSpinnerProps = React.DetailedHTMLProps<
  React.SVGAttributes<SVGSVGElement>,
  SVGSVGElement
> & {
  loading?: boolean;
};

export function LoadingSpinner({ className, loading }: LoadingSpinnerProps) {
  loading = !!loading;

  const [playAnimation, setPlayAnimation] = useState(loading);

  className = createClassName(
    'transition-opacity duration-150',
    loading ? 'opacity-100 duration-100' : 'opacity-0',
    playAnimation && 'animate-spin',
    !/\bw-/.test(className ?? '') && 'w-7',
    !/\btext-\w+-\d+/.test(className ?? '') && 'text-indigo-500',
    className
  );

  useEffect(() => {
    if (loading === playAnimation) {
      return;
    }

    if (loading) {
      setPlayAnimation(loading);
      return;
    }

    const timeoutID = setTimeout(() => setPlayAnimation(loading!), 110);
    return () => clearTimeout(timeoutID);
  }, [loading, playAnimation]);

  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 42 42" stroke="currentColor">
      <g fill="none" fillRule="evenodd">
        <g transform="translate(1 1)" strokeWidth="3">
          <circle strokeOpacity=".3" cx="18" cy="18" r="18" />
          <path d="M36 18c0-9.94-8.06-18-18-18" />
        </g>
      </g>
    </svg>
  );
}
