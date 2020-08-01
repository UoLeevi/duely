import React from 'react';
import home from './home';
import profile from './profile';
import VerifyAuth from 'components/VerifyAuth';

export default [
  {
    path: '/',
    element: <VerifyAuth />,
    children: [
      ...home,
      ...profile
    ]
  }
];
