import React from 'react';
import { BsHouse, BsBriefcase, BsFolder, BsPeople, BsLayoutTextWindowReverse } from 'react-icons/bs';
import { MemoryRouter as Router } from 'react-router-dom';
import ResponsiveLayout from '../ResponsiveLayout';
import Nav from 'components/Nav';

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
        to: '/portal'
      }
    },
    {
      text: 'Projects',
      icon: BsBriefcase,
      link: {
        to: '/projects'
      }
    },
    {
      text: 'Files',
      icon: BsFolder,
      link: {
        to: '/files'
      }
    },
    {
      text: 'Users',
      icon: BsPeople,
      link: {
        to: '/users'
      },
      items: [
        {
          text: 'Agency',
          link: {
            to: 'users/agency'
          }
        },
        {
          text: 'Clients',
          link: {
            to: 'users/clients'
          }
        },
        {
          text: 'Subscribers',
          link: {
            to: 'users/subscribers'
          }
        },
      ]
    },
    {
      text: 'Site',
      icon: BsLayoutTextWindowReverse,
      link: {
        to: '/site'
      },
      items: [
        {
          text: 'Theme',
          link: {
            to: 'site/theme'
          }
        },
        {
          text: 'Domains',
          link: {
            to: 'site/domains'
          }
        }
      ]
    }
  ];

  const nav = (props) => <Nav items={ navItems } { ...props } />;

  const routes = [
    {
      path: "/portal",
      nav
    },
    {
      path: "*",
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
      path: "/",
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
