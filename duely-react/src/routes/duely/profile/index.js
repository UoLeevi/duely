import React from 'react';
import { BsHouse } from 'react-icons/bs';
import { client, query } from 'apollo';
import ResponsiveLayout from 'components/ResponsiveLayout';
import Topbar from 'components/Topbar';
import TopbarActions from 'components/TopbarActions';
import DuelyLogo from 'components/DuelyLogo';
import Nav from 'components/Nav';
import HeaderWithActions from 'components/HeaderWithActions';
import Profile from 'components/Profile';
import BrandCardList from 'components/BrandCardList';

const nav = (
  <Nav items={[
    {
      text: 'Overview',
      icon: BsHouse,
      link: {
        to: '/profile',
        end: true
      }
    }
  ]} />
);

export default [
  {
    path: 'profile',
    element: <Profile />,
    children: [
      {
        path: '/',
        element: (
          <ResponsiveLayout
            nav={ nav }
            header={ <HeaderWithActions title="Profile" subtitle="Overview" /> }
            main={ <BrandCardList /> }
          />
        )
      }
    ],
    validate: () => query('profile')
  }
];
