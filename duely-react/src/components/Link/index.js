import React from 'react';
import { createPath, parsePath } from 'history';
import useAppState from 'hooks/useAppState';

const Link = ({ to, end, children, ...props }) => {
  const [, send] = useAppState();

  const path = typeof to === 'string' ? to : createPath(to);
  const location = parsePath(path);

  const handleClick = e => {
    e.preventDefault();
    send({ type: 'NAVIGATION', location });
  };

  return (
    <a href={ path } { ...props } onClick={ handleClick }>
      { children }
    </a>
  );
};

export default Link;
