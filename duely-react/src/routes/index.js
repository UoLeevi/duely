import portal from './portal';
import dashboard from './dashboard';

const duelyRoutes = Array.from([
  {
    path: '/'
  },
  {
    path: 'profile'
  }
]);

const subdomainRoutes = [
  {
    path: '/'
  },
  ...dashboard,
  ...portal
];

const routes = process.env.NODE_ENV === 'production'
  ? window.location.hostname.split('.').length === 3
    ? subdomainRoutes
    : duelyRoutes
  : (new URLSearchParams(window.location.search)).has('subdomain')
    ? subdomainRoutes
    : duelyRoutes;

function flattenRoutes(routes, base = '') {
  let flatRoutes = {};
  routes.forEach(route => {
    const path = route.path.endsWith('/')
      ? route.path.substr(0, route.path.length - 1)
      : route.path;

    const fullpath = base + '/' + path;
    flatRoutes[fullpath] = route;
    flatRoutes = { ...flatRoutes, ...flattenRoutes(route.children ?? [], fullpath) };
  });

  return flatRoutes;
}

export function createRoutesProxy(routes) {
  const flatRoutes = flattenRoutes(routes);
  const handler = {
    get(target, prop, receiver) {
      return (prop in target)
        ? target[prop]
        : flatRoutes[prop];
    }
  };

  return new Proxy(routes, handler);
}

export default createRoutesProxy(routes);
