import { TopBar } from '@duely/react';
import { Link, Route, RouteProps, Switch } from 'react-router-dom';
import DuelyLogo from '~/components/DuelyLogo';
import NavMenu from '~/components/NavMenu';
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

TopBar.defaults.children = (
  <>
    <Link
      to="/"
      className="relative flex items-center h-8 p-1 space-x-2 text-gray-900 rounded md:h-12"
    >
      <DuelyLogo className="h-full" />
      <span className="text-2xl font-bold">Duely</span>
    </Link>
    <div className="relative inline-block">
      <NavMenu />
    </div>
  </>
);

export default function Pages() {
  return (
    <Switch>
      {routes.map((route, i) => (
        <Route key={i} {...route} />
      ))}
    </Switch>
  );
}
