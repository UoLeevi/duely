import React from 'react';
import { query } from 'apollo';
import ProfileRoot from 'components/ProfileRoot';
import ProfileSelectBrand from 'components/ProfileSelectBrand';

export default [
  {
    path: 'profile',
    element: <ProfileRoot />,
    children: [
      {
        path: '/',
        element: <ProfileSelectBrand />
      }
    ],
    enter: () => query('profile')
  }
];
