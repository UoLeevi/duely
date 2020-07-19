import React from 'react';
import { BsHouse } from 'react-icons/bs';
import ResponsiveLayout from 'components/ResponsiveLayout';
import Topbar from 'components/Topbar';
import TopbarActions from 'components/TopbarActions';
import DuelyLogo from 'components/DuelyLogo';
import Nav from 'components/Nav';
import HeaderWithActions from 'components/HeaderWithActions';
import Profile from 'components/Profile';

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
            topbar={
              <Topbar className="gutter py-4">
                <div className="flex row center-v">
                  <DuelyLogo />
                  <h1 className="f-5 f-b pa-2">Duely</h1>
                </div>
                <TopbarActions links={[
                  { to: '/', text: 'Home' }
                ]} />
              </Topbar>
            }
            nav={ nav }
            header={ <HeaderWithActions title="Profile" subtitle="Overview" /> }
          />
        )
      }
    ]
  }
];
