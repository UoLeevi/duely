import { createClassName, hasProperty } from '@duely/util';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { usePrevious } from '../..';

export const Animation = Object.assign({}, { Fade });

type FadeProps = {
  children: React.ReactNode;
  className?: string;
};

function getReactNodeId(node: React.ReactNode) {
  if (hasProperty(node, 'key')) {
    return `${node.type}-${node.key}`;
  }

  return node;
}

function doesReactNodeHaveSameId(a: React.ReactNode, b: React.ReactNode) {
  return getReactNodeId(a) === getReactNodeId(b);
}

function Fade({ children, className, ...props }: FadeProps) {
  const [fadeOut, setFadeOut] = useState<{ node: React.ReactNode; timeoutId: number }>();
  const [previous, { changed }] = usePrevious<React.ReactNode>(children, {
    skip: doesReactNodeHaveSameId,
    returnTuple: true,
    retain: true
  });

  useLayoutEffect(() => {
    if (!changed) return;
    clearTimeout(fadeOut?.timeoutId);
    const timeoutId = window.setTimeout(() => setFadeOut(undefined), 200);
    setFadeOut({ node: previous, timeoutId });
  }, [changed]);

  useEffect(() => () => window.clearTimeout(fadeOut?.timeoutId), []);
  children = changed ? previous : fadeOut?.node || children;

  return (
    <div
      className={createClassName(
        className,
        'transition-opacity duration-200 ease-in-out',
        changed || !!fadeOut ? 'opacity-0' : 'opacity-100'
      )}
    >
      {children}
    </div>
  );
}
