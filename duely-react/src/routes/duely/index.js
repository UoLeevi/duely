import home from './home';
import profile from './profile';

export default [
  {
    path: '/',
    children: [
      ...home,
      ...profile
    ]
  }
];
