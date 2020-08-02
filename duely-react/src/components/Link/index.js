import React from 'react';
import { createPath, parsePath } from 'history';
import useAppState from 'hooks/useAppState';

function useLinkProps(to, props) {
  const [, send] = useAppState();

  if (to === undefined) {
    const onClick = e => {
      e.preventDefault();

      if (props.onClick) {
        props.onClick(e);
      }
    };
    return { ...props, onClick, href: '#' }
  }

  if (typeof to === 'object') {
    to = createPath(to);
  }

  const url = new URL(to, window.location.origin);

  if (url.origin !== window.location.origin) {
    return { ...props, href: url.href };
  }

  // subdomain search param is used to indicate a redirect to another duely domain.
  const subdomain = url.searchParams.get('subdomain');

  if (subdomain) {
    if (process.env.NODE_ENV === 'production') {
      url.searchParams.delete('subdomain');

      if (!url.searchParams.has('access_token')) {
        const access_token = localStorage.getItem('user-jwt');

        if (access_token) {
          url.searchParams.set('access_token', encodeURIComponent(access_token));
        }
      }

      url.hostname = `${subdomain}.duely.app`;
    }

    return { ...props, href: url.href };
  }

  const onClick = e => {
    e.preventDefault();
    const location = parsePath(to);
    send({ type: 'NAVIGATION_REQUESTED', location });

    if (props.onClick) {
      props.onClick(e);
    }
  };

  return { ...props, href: to, onClick };
}

const Link = ({ to, end, children, ...props }) => {
  props = useLinkProps(to, props);

  return (
    <a { ...props }>
      { children }
    </a>
  );
};

export default Link;
