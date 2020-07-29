import React from 'react';
import { match } from 'path-to-regexp';
import LoadingBar from 'components/LoadingBar';
// import LoadingSpinner from 'components/LoadingSpinner';
import Route from 'components/Route';
import useAppState from 'hooks/useAppState';
import duely from './duely';
import agency from './agency';

const matchFunctions = {}

function pathMatcher(path, options) {
  let matcher = matchFunctions[path];

  if (!matcher) {
    matcher = match(path, { encode: encodeURI, decode: decodeURIComponent, end: false, ...options });
    matchFunctions[path] = matcher;
  }

  return matcher;
}

export function joinPathParts(base, path) {
  if (!base) {
    return path;
  }

  if (!path) {
    return base;
  }

  if (base[base.length - 1] === '/') {
    base = base.substr(0, base.length - 1);
  }

  if (path[0] === '/') {
    path = path.substr(1);
  }

  return base + '/' + path;
}

export function matchPath({ path, end }, pathname) {
  return pathMatcher(path, { end })(pathname);
}

export function matchRoute(route, pathname) {
  const { path, children } = route;
  const end = (children?.length ?? 0) === 0;

  return pathMatcher(path, { end })(pathname || '/');
}

function resolveDomain() {
  const domain = window.location.hostname.toLowerCase();
  let subdomain = null;

  if (process.env.NODE_ENV === 'production') {
    if (domain !== 'duely.app') {
      if (domain.endsWith('.duely.app')) {
        subdomain = domain.slice(0, -'.duely.app'.length);
      } else {
        // TODO: check from database
        throw new Error('Not implemented.');
      }
    }
  } else {
    const queryParams = new URLSearchParams(window.location.search);
    let name = queryParams.get('subdomain');

    if (name) {
      subdomain = name.toLowerCase();
    }
  }
  return { domain, subdomain };
}

export const { domain, subdomain } = resolveDomain();
export const routes = subdomain === null ? duely : agency;

export const RoutesRoot = () => {
  const [state, ] = useAppState();
  return (
    <>
      <LoadingBar loading={ state.matches('navigation.processing') } style={{ position: 'absolute', top: '0', left: '0', zIndex: 1 }} />
      <Route />
      {/* { element ?? <div className="grid w-100 h-100 items-center gutter"><LoadingSpinner size="20%" stroke="var(--color-primary-l4)" /></div> } */}
    </>
  );
};

