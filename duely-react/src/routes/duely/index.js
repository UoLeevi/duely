import React from 'react';
import home from './home';
import profile from './profile';
import DuelyRoot from 'components/DuelyRoot';

export default [
  {
    path: '/',
    element: <DuelyRoot />,
    children: [
      ...home,
      ...profile
    ]
  }
];
