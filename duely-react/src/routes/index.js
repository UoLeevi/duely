const duelyRoutes = Array.from([
  {
    path: '/',
    name: 'Home'
  },
  {
    path: 'profile',
    name: 'Profile',
    children: [
      
    ]
  }
]);

const subdomainRoutes = [
  {
    path: '/',
    name: 'Home'
  },
  {
    path: 'dashboard',
    name: 'Dashboard',
    children: [
      {
        path: '',
        name: 'Overview'
      },
      {
        path: 'projects',
        name: 'Projects'
      },
      {
        path: 'services',
        name: 'Services'
      },
      {
        path: 'users',
        name: 'Users',
        children: [
          {
            path: 'agency',
            name: 'Agency'
          },
          {
            path: 'clients',
            name: 'Clients'
          },
          {
            path: 'invites',
            name: 'Invites'
          }
        ]
      },
      {
        path: 'site',
        name: 'Site',
        children: [
          {
            path: 'theme',
            name: 'Theme'
          },
          {
            path: 'domains',
            name: 'Domains'
          }
        ]
      },
      {
        path: 'payments',
        name: 'Payments'
      }
    ]
  },
  {
    path: 'portal',
    name: 'Portal',
    children: [
      {
        path: '',
        name: 'Overview'
      },
      {
        path: 'projects',
        name: 'Projects'
      },
      {
        path: 'files',
        name: 'Files'
      },
      {
        path: 'billing',
        name: 'Billing'
      },
      {
        path: 'services',
        name: 'Services'
      }
    ]
  }
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
      if (typeof prop === 'string') {
        return flatRoutes[prop];
      }
  
      return Reflect.get(...arguments);
    }
  };

  return new Proxy(routes, handler);
}

export default createRoutesProxy(routes);
