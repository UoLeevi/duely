import { Link, Route, RouteProps, Switch } from 'react-router-dom';
import Dashboard from './dashboard';
import ThankYouPage from './orders/thank-you';
import LogIn from './log-in';
import SignUp from './sign-up';
import PasswordReset from './password-reset';
import SetNewPassword from './set-new-password';
import { DynamicPage } from '../components/DynamicPage';
import { TopBar } from '@duely/react';
import { current_subdomain_Q, useQuery } from '@duely/client';
import NavMenu from '~/components/NavMenu';

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

TopBar.defaults.children = () => {
  const { data: current_subdomain } = useQuery(current_subdomain_Q);
  return (
    <>
      <Link
        to="/"
        className="relative flex items-center h-8 p-1 space-x-2 text-gray-900 rounded md:h-12"
      >
        <img className="h-full" src={current_subdomain?.agency.theme.image_logo?.data} alt="logo" />
        <span className="text-2xl font-bold">{current_subdomain?.agency?.name}</span>
      </Link>
      <div className="relative inline-block">
        <NavMenu />
      </div>
    </>
  );
};

export default function Pages() {
  return (
    <Switch>
      {routes.map((route, i) => (
        <Route key={i} {...route} />
      ))}
    </Switch>
  );
}
