import React, { useEffect, useState } from 'react';
import { Util } from '../../util';

type LoadingSpinnerProps = React.DetailedHTMLProps<
  React.SVGAttributes<SVGSVGElement>,
  SVGSVGElement
> & {
  loading?: boolean;
};

export function LoadingSpinner({ className, loading }: LoadingSpinnerProps) {
  loading = !!loading;

  const [playAnimation, setPlayAnimation] = useState(loading);

  className = Util.createClassName(
    'transition-opacity duration-150',
    loading ? 'opacity-100 duration-100' : 'opacity-0',
    playAnimation && 'animate-spin',
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
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 38" stroke="#fff">
      <g fill="none" fillRule="evenodd">
        <g transform="translate(1 1)" strokeWidth="2">
          <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
          <path d="M36 18c0-9.94-8.06-18-18-18" />
        </g>
      </g>
    </svg>
  );
}
