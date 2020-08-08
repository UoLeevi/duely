import React from 'react';
import { BsHouse, BsBriefcase, BsFolder, BsKanban, BsCreditCard } from 'react-icons/bs';
import PortalRoot from 'components/PortalRoot';
import ResponsiveLayout from 'components/ResponsiveLayout';
import Nav from 'components/Nav';
import HeaderWithActions from 'components/HeaderWithActions';

const nav = (
  <Nav items={[
    {
      text: 'Overview',
      icon: BsHouse,
      link: {
        to: '/portal',
        end: true
      }
    },
    {
      text: 'Projects',
      icon: BsKanban,
      link: {
        to: '/portal/projects',
        end: false
      }
    },
    {
      text: 'Files',
      icon: BsFolder,
      link: {
        to: '/portal/files',
        end: false
      }
    },
    {
      text: 'Billing',
      icon: BsCreditCard,
      link: {
        to: '/portal/billing',
        end: false
      }
    },
    {
      text: 'Services',
      icon: BsBriefcase,
      link: {
        to: '/portal/services',
        end: false
      }
    }
  ]} />
);

export default [
  {
    path: 'portal',
    element: <PortalRoot />,
    children: [
      {
        path: '/',
        element: (
          <ResponsiveLayout 
            nav={ nav }
            header={ <HeaderWithActions title="Overview" /> }
          />
        )
      },
      {
        path: 'projects',
        element: (
          <ResponsiveLayout 
            nav={ nav }
            header={ <HeaderWithActions title="Projects" /> }
          />
        )
      },
      {
        path: 'files',
        element: (
          <ResponsiveLayout 
            nav={ nav }
            header={ <HeaderWithActions title="Files" /> }
          />
        )
      },
      {
        path: 'billing',
        element: (
          <ResponsiveLayout 
            nav={ nav }
            header={ <HeaderWithActions title="Billing" /> }
          />
        )
      },
      {
        path: 'services',
        element: (
          <ResponsiveLayout 
            nav={ nav }
            header={ <HeaderWithActions title="Services" /> }
          />
        )
      }
    ]
  }
];
