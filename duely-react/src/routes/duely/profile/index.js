import React from 'react';
import { query } from 'apollo';
import FocusedLayout from 'components/FocusedLayout';
import Profile from 'components/Profile';
import BrandCardList from 'components/BrandCardList';
import NavButton from 'components/NavButton';
import { BsGear } from 'react-icons/bs';

export default [
  {
    path: 'profile',
    element: <Profile />,
    children: [
      {
        path: '/',
        element: (
          <FocusedLayout
            main={ <BrandCardList /> }
            actions={ <NavButton link={{ to: '/profile/settings' }} icon={ BsGear } /> }
          />
        )
      }
    ],
    enter: () => query('profile')
  }
];
