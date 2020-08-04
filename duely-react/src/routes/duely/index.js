import React from 'react';
import home from './home';
import profile from './profile';
import VerifyAuth from 'components/VerifyAuth';

export default [
  {
    path: '/',
    element: <VerifyAuth data-bg="l4" />,
    children: [
      ...home,
      ...profile
    ]
  }
];
