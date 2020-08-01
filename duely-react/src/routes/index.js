import React, { useEffect } from 'react';
import { BsExclamationDiamond, BsExclamationTriangle } from 'react-icons/bs';
import { match } from 'path-to-regexp';
import LoadingBar from 'components/LoadingBar';
// import LoadingSpinner from 'components/LoadingSpinner';
import Route from 'components/Route';
import useMessage from 'hooks/useMessage';
import useAppState from 'hooks/useAppState';
import useRouteEvent from 'hooks/useRouteEvent';
import duely from './duely';
import agency from './agency';

function pathMatcher(path, options) {
  return match(path, { encode: encodeURI, decode: decodeURIComponent, end: false, ...options });
}

export function joinPathParts(base, path) {
  base = base ?? '';
  path = path ?? '';
  path = base + '/' + path;
  path = path.replace(/\/\/+/g, '/');

  if (path.length > 1 && path[path.length - 1] === '/') {
    path = path.substr(0, path.length - 1);
  }

  return path;
}

export function matchPath({ path, end }, pathname) {
  return pathMatcher(path, { end })(pathname);
}

function resolveDomain() {
  const url = new URL(window.location.href);
  const domain = url.hostname.toLowerCase();
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
    let name = url.searchParams.get('subdomain');

    if (name) {
      url.searchParams.delete('subdomain');
      window.history.replaceState(window.history.state, document.title, url.href);
      subdomain = name.toLowerCase();
    }
  }
  return { domain, subdomain };
}

export const { domain, subdomain } = resolveDomain();
export const routes = subdomain === null ? duely : agency;

export const RoutesRoot = () => {
  const [state, ] = useAppState();
  const showInDevelopmentMessage = useMessage(
    <div className="flex row center-v f-b">
      <BsExclamationDiamond className="accent color-l1n pr-3 f-4" />
      <span>Duely is still in development</span>
    </div>
  , { autoHideMs: 10000 });

  useEffect(showInDevelopmentMessage, []);

  const showNavigationRejectedMessage = useMessage(
    <div className="flex row center-v f-b">
      <BsExclamationTriangle className="error color-l1n pr-3 f-4" />
      <span>Sorry! The page in not yet ready.</span>
    </div>
  , { autoHideMs: 4000 });

  useRouteEvent('rejected', showNavigationRejectedMessage);

  return (
    <>
      <LoadingBar loading={ state.matches('navigation.processing') } style={{ position: 'absolute', top: '0', left: '0', zIndex: 1 }} />
      <Route />
      {/* { element ?? <div className="grid w-100 h-100 items-center g-2"><LoadingSpinner size="20%" stroke="var(--color-primary-l4)" /></div> } */}
    </>
  );
};

