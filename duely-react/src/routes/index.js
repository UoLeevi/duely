import React from 'react';
import { match } from 'path-to-regexp';
import { parsePath } from 'history';
// import { useBlocker, useNavigate, useLocation, useRoutes } from 'react-router-dom';
// import { DomainContext } from 'contexts/DomainContext';
import LoadingBar from 'components/LoadingBar';
import LoadingSpinner from 'components/LoadingSpinner';
import Route from 'components/Route';
import useActiveRouteState from 'hooks/useActiveRouteState';
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

// export function joinPathParts(base, path) {
//   if (!base) {
//     return path;
//   }

//   if (!path) {
//     return base;
//   }

//   if (base[base.length - 1] === '/') {
//     base = base.substr(0, base.length - 1);
//   }

//   if (path[0] === '/') {
//     path = path.substr(1);
//   }

//   return base + '/' + path;
// }

export function matchPath({ path, end }, pathname) {
  return pathMatcher(path, { end })(pathname);
}

export function matchRoute(route, pathname) {
  const { path, children } = route;
  const end = (children?.length ?? 0) === 0;

  return pathMatcher(path, { end })(pathname || '/');
}

// export function matchRoutes(routes, { location, ...event }) {
//   if (typeof location === 'string') {
//     location = parsePath(location);
//   }

//   const pathname = location.pathname || '/';
//   const route = routes?.find(({ path }) => pathMatcher(path)(pathname)?.index === 0);

//   if (!route) {
//     return location.pathname === ''
//       ? Promise.resolve({ location, ...event })
//       : Promise.reject({ location, ...event });
//   }

//   const { path, params } = pathMatcher(route.path)(pathname);
//   const basename = joinPathParts(location.basename, path);
//   location = { ...location, pathname: location.pathname.substring(path.length), basename };
//   return Promise.resolve({ location, ...event, route, params });
// }

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
  const [state, ] = useActiveRouteState();
  // const navigate = useNavigate();
  // const location = useLocation();
  // const { subdomain } = useContext(DomainContext);

  // useEffect(() => {
  //   if (state.matches('navigation.indeterminate')) {
  //     send({ type: 'NAVIGATION', location });
  //     return;
  //   }

  //   if (state.matches('navigation.confirmed') && state.context.location.pathname !== location.pathname) {
  //     navigate(state.context.location);
  //     return;
  //   }

  // }, [state, send, location, navigate]);

  // function handleNavigation({ action, location, retry }) {
  //   if (state.context.navigatingLocation?.pathname !== location.pathname) {
  //     send({ type: 'NAVIGATION', action, location });
  //   }
  // }

  // console.log(state.value.navigation)

  // useBlocker(handleNavigation, true);
  // const element = useRoutes(subdomain === null ? duely : agency);
  return (
    <>
      <LoadingBar loading={ state.matches('processing') } style={{ position: 'absolute', top: '0', left: '0', zIndex: 1 }} />
      <Route />
      {/* { element ?? <div className="grid w-100 h-100 items-center gutter"><LoadingSpinner size="20%" stroke="var(--color-primary-l4)" /></div> } */}
    </>
  );
};

