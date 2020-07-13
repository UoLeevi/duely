import React from 'react';
import { BsHouse } from 'react-icons/bs';
import ResponsiveLayout from 'components/ResponsiveLayout';
import Nav from 'components/Nav';
import HeaderWithActions from 'components/HeaderWithActions';

const nav = (
  <Nav items={[
    {
      text: 'Overview',
      icon: BsHouse,
      link: {
        to: '/dashboard',
        end: true
      }
    }
  ]} />
);

export default [
  {
    path: 'profile',
    element: (
      <ResponsiveLayout 
        nav={ nav }
        header={ <HeaderWithActions title="Profile" /> }
      />
    )
  }
];
