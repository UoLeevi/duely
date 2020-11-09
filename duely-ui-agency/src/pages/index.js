import { Route, Switch } from 'react-router-dom';
import Home from './home';
import Dashboard from './dashboard';

const routes = [
  {
    path: '/dashboard',
    component: Dashboard
  },
  {
    path: '/',
    component: Home
  }
];

export default function Pages() {
  return (
    <Switch>
      {routes.map((route, i) => (
        <RouteWithSubRoutes key={i} {...route} />
      ))}
    </Switch>
  );
}

function RouteWithSubRoutes(route) {
  return (
    <Route
      path={route.path}
      render={props => (
        // pass the sub-routes down to keep nesting
        <route.component {...props} routes={route.routes} />
      )}
    />
  );
};
