import React from 'react';
import { BsHouse, BsBriefcase, BsFolder, BsPeople, BsLayoutTextWindowReverse } from 'react-icons/bs';
import { MemoryRouter as Router, useRoutes } from 'react-router-dom';
import ResponsiveLayout from '../ResponsiveLayout';
import Nav from 'components/Nav';
import HeaderWithActions from 'components/HeaderWithActions';

export default {
  title: 'ResponsiveLayout',
  component: ResponsiveLayout,
  parameters: {
    layout: 'fullscreen'
  },
  decorators: [
    Fn => (
      <Router>
        <Fn />
      </Router>
    )
  ]
};

const navItems = [
  {
    text: 'Portal',
    icon: BsHouse,
    link: {
      to: '/portal',
      end: true
    }
  },
  {
    text: 'Projects',
    icon: BsBriefcase,
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
    text: 'Users',
    icon: BsPeople,
    link: {
      to: '/portal/users',
      end: false
    },
    items: [
      {
        text: 'Agency',
        link: {
          to: '/portal/users/agency',
          end: false
        }
      },
      {
        text: 'Clients',
        link: {
          to: '/portal/users/clients',
          end: false
        }
      },
      {
        text: 'Subscribers',
        link: {
          to: '/portal/users/subscribers',
          end: false
        }
      },
    ]
  },
  {
    text: 'Site',
    icon: BsLayoutTextWindowReverse,
    link: {
      to: '/portal/site',
      end: false
    },
    items: [
      {
        text: 'Theme',
        link: {
          to: '/portal/site/theme',
          end: false
        }
      },
      {
        text: 'Domains',
        link: {
          to: '/portal/site/domains',
          end: false
        }
      }
    ]
  }
];

const routes = [
  {
    path: '/',
    element: (
      <ResponsiveLayout 
        nav={ <Nav items={ navItems } /> }
        header={ <HeaderWithActions title="Portal" /> }
      />
    )
  },
  {
    path: 'portal',
    element: (
      <ResponsiveLayout 
        nav={ <Nav items={ navItems } /> }
        header={ <HeaderWithActions title="Portal" /> }
      />
    )
  },
  {
    path: 'portal/projects',
    element: (
      <ResponsiveLayout 
        nav={ <Nav items={ navItems } /> }
        header={ <HeaderWithActions title="Projects" /> }
      />
    )
  },
  {
    path: 'portal/files',
    element: (
      <ResponsiveLayout 
        nav={ <Nav items={ navItems } /> }
        header={ <HeaderWithActions title="Files" /> }
      />
    )
  },
  {
    path: 'portal/users',
    element: (
      <ResponsiveLayout 
        nav={ <Nav items={ navItems } /> }
        header={ <HeaderWithActions title="Users" /> }
      />
    )
  },
  {
    path: 'portal/users/agency',
    element: (
      <ResponsiveLayout 
        nav={ <Nav items={ navItems } /> }
        header={ <HeaderWithActions title="Users" subtitle="Agency" /> }
      />
    )
  },
  {
    path: 'portal/users/clients',
    element: (
      <ResponsiveLayout 
        nav={ <Nav items={ navItems } /> }
        header={ <HeaderWithActions title="Users" subtitle="Clients" /> }
      />
    )
  },
  {
    path: 'portal/users/subscribers',
    element: (
      <ResponsiveLayout 
        nav={ <Nav items={ navItems } /> }
        header={ <HeaderWithActions title="Users" subtitle="Subscribers" /> }
      />
    )
  },
  {
    path: 'portal/site',
    element: (
      <ResponsiveLayout 
        nav={ <Nav items={ navItems } /> }
        header={ <HeaderWithActions title="Site" /> }
      />
    )
  },
  {
    path: 'portal/site/theme',
    element: (
      <ResponsiveLayout 
        nav={ <Nav items={ navItems } /> }
        header={ <HeaderWithActions title="Site" subtitle="Theme" /> }
      />
    )
  },
  {
    path: 'portal/site/domains',
    element: (
      <ResponsiveLayout 
        nav={ <Nav items={ navItems } /> }
        header={ <HeaderWithActions title="Site" subtitle="Domains" /> }
      />
    )
  },
];


export const WithDefaultComponents = () => useRoutes(routes);
