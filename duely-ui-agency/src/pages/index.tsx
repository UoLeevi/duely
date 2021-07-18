import { Route, RouteProps, Switch } from 'react-router-dom';
import Dashboard from './dashboard';
import ThankYouPage from './orders/thank-you';
import LogIn from './log-in';
import SignUp from './sign-up';
import PasswordReset from './password-reset';
import SetNewPassword from './set-new-password';
import { DynamicPage } from '../components/DynamicPage';

const routes: RouteProps[] = [
  {
    path: '/log-in',
    component: LogIn
  },
  {
    path: '/sign-up',
    component: SignUp
  },
  {
    path: '/password-reset',
    component: PasswordReset
  },
  {
    path: '/set-new-password',
    component: SetNewPassword
  },
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
    component: DynamicPage
  }
];

export default function Pages() {
  return (
    <Switch>
      {routes.map((route, i) => (
        <Route key={i} {...route} />
      ))}
    </Switch>
  );
}
