import React from 'react';
import { BsHouse, BsBriefcase, BsFolder, BsKanban, BsCreditCard } from 'react-icons/bs';
import ResponsiveLayout from 'components/ResponsiveLayout';
import Nav from 'components/Nav';
import HeaderWithActions from 'components/HeaderWithActions';

const nav = (
  <Nav items={[
    {
      text: 'Overview',
      icon: BsHouse,
      link: {
        to: 'portal',
        end: true
      }
    },
    {
      text: 'Projects',
      icon: BsKanban,
      link: {
        to: 'portal/projects',
        end: false
      }
    },
    {
      text: 'Files',
      icon: BsFolder,
      link: {
        to: 'portal/files',
        end: false
      }
    },
    {
      text: 'Billing',
      icon: BsCreditCard,
      link: {
        to: 'portal/billing',
        end: false
      }
    },
    {
      text: 'Services',
      icon: BsBriefcase,
      link: {
        to: 'portal/services',
        end: false
      }
    }
  ]} />
);

export default [
  {
    path: 'portal/projects',
    element: (
      <ResponsiveLayout 
        nav={ nav }
        header={ <HeaderWithActions title="Projects" /> }
      />
    )
  },
  {
    path: 'portal/files',
    element: (
      <ResponsiveLayout 
        nav={ nav }
        header={ <HeaderWithActions title="Files" /> }
      />
    )
  },
  {
    path: 'portal/billing',
    element: (
      <ResponsiveLayout 
        nav={ nav }
        header={ <HeaderWithActions title="Billing" /> }
      />
    )
  },
  {
    path: 'portal/services',
    element: (
      <ResponsiveLayout 
        nav={ nav }
        header={ <HeaderWithActions title="Services" /> }
      />
    )
  },
  {
    path: 'portal',
    element: (
      <ResponsiveLayout 
        nav={ nav }
        header={ <HeaderWithActions title="Overview" /> }
      />
    )
  },
];
