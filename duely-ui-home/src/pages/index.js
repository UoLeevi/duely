import Home from './home';
import LogIn from './log-in';
import NewBrand from './new-brand';
import PasswordReset from './password-reset';
import Profile from './profile';
import SignUp from './sign-up';

export const routes = [
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
