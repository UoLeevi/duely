import React from 'react';
import { BsHouse, BsBriefcase, BsKanban, BsCreditCard, BsPeople, BsLayoutTextWindowReverse } from 'react-icons/bs';
import ResponsiveLayout from 'components/ResponsiveLayout';
import Nav from 'components/Nav';
import HeaderWithActions from 'components/HeaderWithActions';

const nav = (
  <Nav items={ [
    {
      text: 'Overview',
      icon: BsHouse,
      link: {
        to: '/dashboard',
        end: true
      }
    },
    {
      text: 'Projects',
      icon: BsKanban,
      link: {
        to: '/dashboard/projects',
        end: false
      }
    },
    {
      text: 'Services',
      icon: BsBriefcase,
      link: {
        to: '/dashboard/services',
        end: false
      }
    },
    {
      text: 'Users',
      icon: BsPeople,
      link: {
        to: '/dashboard/users',
        end: false
      },
      items: [
        {
          text: 'Agency',
          link: {
            to: '/dashboard/users/agency',
            end: false
          }
        },
        {
          text: 'Clients',
          link: {
            to: '/dashboard/users/clients',
            end: false
          }
        }
      ]
    },
    {
      text: 'Site',
      icon: BsLayoutTextWindowReverse,
      link: {
        to: '/dashboard/site',
        end: false
      },
      items: [
        {
          text: 'Theme',
          link: {
            to: '/dashboard/site/theme',
            end: false
          }
        }
      ]
    },
    {
      text: 'Payments',
      icon: BsCreditCard,
      link: {
        to: '/dashboard/payments',
        end: false
      }
    }
  ] } />
);

export default [
  {
    path: 'dashboard',
    element: (
      <ResponsiveLayout 
        nav={ nav }
        header={ <HeaderWithActions title="Overview" /> }
      />
    )
  },
  {
    path: 'dashboard/projects',
    element: (
      <ResponsiveLayout 
        nav={ nav }
        header={ <HeaderWithActions title="Projects" /> }
      />
    )
  },
  {
    path: 'dashboard/services',
    element: (
      <ResponsiveLayout 
        nav={ nav }
        header={ <HeaderWithActions title="Services" /> }
      />
    )
  },
  {
    path: 'dashboard/users',
    element: (
      <ResponsiveLayout 
        nav={ nav }
        header={ <HeaderWithActions title="Users" /> }
      />
    )
  },
  {
    path: 'dashboard/users/agency',
    element: (
      <ResponsiveLayout 
        nav={ nav }
        header={ <HeaderWithActions title="Users" subtitle="Agency" /> }
      />
    )
  },
  {
    path: 'dashboard/users/clients',
    element: (
      <ResponsiveLayout 
        nav={ nav }
        header={ <HeaderWithActions title="Users" subtitle="Clients" /> }
      />
    )
  },
  {
    path: 'dashboard/site',
    element: (
      <ResponsiveLayout 
        nav={ nav }
        header={ <HeaderWithActions title="Site" /> }
      />
    )
  },
  {
    path: 'dashboard/site/theme',
    element: (
      <ResponsiveLayout 
        nav={ nav }
        header={ <HeaderWithActions title="Site" subtitle="Theme" /> }
      />
    )
  },
  {
    path: 'dashboard/payments',
    element: (
      <ResponsiveLayout 
        nav={ nav }
        header={ <HeaderWithActions title="Payments" /> }
      />
    )
  }
];
