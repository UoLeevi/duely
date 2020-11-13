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
      {routes.map((route, i) => <Route key={i} { ...route } />)}
    </Switch>
  );
}
