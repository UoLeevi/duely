import home from './home';
import portal from './portal';
import dashboard from './dashboard';

export default [
  {
    path: '/',
    children: [
      ...home,
      ...portal,
      ...dashboard,
    ]
  }
];
