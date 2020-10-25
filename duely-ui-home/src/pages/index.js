import Home from './home';
import LogIn from './log-in';
import PasswordReset from './password-reset';
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
    path: '/',
    component: Home
  }
];
