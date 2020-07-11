import React from 'react';
import { BsHouse, BsBriefcase, BsFolder, BsPeople, BsLayoutTextWindowReverse } from 'react-icons/bs';
import { MemoryRouter as Router } from 'react-router-dom';
import ResponsiveLayout from '../ResponsiveLayout';
import Nav from 'components/Nav';
import HeaderWithActions from 'components/HeaderWithActions';
import withProps from 'hoc/withProps';
import withDynamicProps from 'hoc/withDynamicProps';
import withLocation from 'hoc/withLocation';
import { subdomainRoutes } from 'routes';

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


export const WithDefaultComponents = () => {
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
        to: '/site',
        end: false
      },
      items: [
        {
          text: 'Theme',
          link: {
            to: '/site/theme',
            end: false
          }
        },
        {
          text: 'Domains',
          link: {
            to: '/site/domains',
            end: false
          }
        }
      ]
    }
  ];

  const nav = withProps(Nav, { items: navItems });
  const header = withLocation(withDynamicProps(HeaderWithActions, ({ location, ...props }) => {
    console.log(location.pathname)
    return { title: subdomainRoutes[location.pathname]?.name, ...props };
  }));

  const routes = [
    {
      path: '/portal',
      nav,
      header: withProps(HeaderWithActions, { title: 'Portal', subtitle: 'Overview' })
    },
    {
      path: '/portal/projects',
      nav,
      header
    },
    {
      path: '/portal/files',
      nav,
      header
    },
    {
      path: '/portal/users',
      nav,
      header,
      children: [
        { path: 'agency' },
        { path: 'clients' },
        { path: 'subscribers' },
      ]
    },
    {
      path: '*',
      nav
    }
  ];

  return (
    <ResponsiveLayout routes={ routes } />
  )
};

export const Areas = () => {
  const routes = [
    {
      path: '/',
      topbar: <div className="pa-1 background-bg bg-l4">topbar</div>,
      nav: <nav className="pa-1 background-bg bg-l4">nav</nav>,
      aside: <aside className="pa-1 background-bg bg-l4">aside</aside>,
      header: <header className="pa-1 background-bg bg-l4">header</header>,
      main: <main className="pa-1 background-bg bg-l4">main</main>,
      footer: <footer className="pa-1 background-bg bg-l4">footer</footer>,
    }
  ];

  return (
    <ResponsiveLayout routes={ routes } />
  )
};
