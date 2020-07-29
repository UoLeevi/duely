import home from './home';
import profile from './profile';
// import VerifyAuth from 'components/VerifyAuth';

export default [
  {
    path: '/',
    children: [
      ...home,
      ...profile
    ]
  }
];
