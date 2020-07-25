import React from 'react';
import { createPath, parsePath } from 'history';
import useAppState from 'hooks/useAppState';

const Link = ({ to, children, ...props }) => {
  const [, send] = useAppState();

  const path = typeof to === 'string' ? to : createPath(to);
  const location = parsePath(path);

  const handleClick = e => {
    e.preventDefault();
    send({ type: 'NAVIGATION_REQUESTED', location });
  };

  return (
    <a href={ path } { ...props } onClick={ handleClick }>
      { children }
    </a>
  );
};

export default Link;
