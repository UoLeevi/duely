import React from 'react';
import { query } from 'apollo';
import ProfileRoot from 'components/ProfileRoot';
import ProfileSelectBrand from 'components/ProfileSelectBrand';
import ProfileCreateBrand from 'components/ProfileCreateBrand';

export default [
  {
    path: 'profile',
    element: <ProfileRoot />,
    children: [
      {
        path: '/',
        element: <ProfileSelectBrand />
      },
      {
        path: 'create-brand',
        element: <ProfileCreateBrand />
      }
    ],
    enter: () => query('profile')
  }
];
