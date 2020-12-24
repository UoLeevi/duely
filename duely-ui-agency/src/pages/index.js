import { Route, Switch } from 'react-router-dom';
import Home from './home';
import Dashboard from './dashboard';
import ThankYouPage from './orders/thank-you';

const routes = [
  {
    path: '/orders/thank-you',
    component: ThankYouPage
  },
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
