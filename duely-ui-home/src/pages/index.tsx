import { Route, RouteProps, Switch } from 'react-router-dom';
import Home from './home';
import LogIn from './log-in';
import NewBrand from './new-brand';
import PasswordReset from './password-reset';
import Profile from './profile';
import SetNewPassword from './set-new-password';
import SignUp from './sign-up';

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
    path: '/profile',
    component: Profile
  },
  {
    path: '/new-brand',
    component: NewBrand
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
