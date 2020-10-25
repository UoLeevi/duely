import { Provider } from 'jotai';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AuthManager from 'components/AuthManager';
import { routes } from 'pages';
import { Suspense } from 'react';

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
}

export default function App() {
  return (
    <Provider>
      <Router>
        <Suspense fallback={ null }>
          <AuthManager />
        </Suspense>
        <Switch>
          { routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route} />
          ))}
        </Switch>
      </Router>
    </Provider>
  );
}
