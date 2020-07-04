import React from 'react';
import { RiHome2Line, RiBriefcase2Line } from 'react-icons/ri';
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


export const Areas = () => {
  const routes = [
    {
      path: "/",
      exact: false,
      topbar: <div className="background-bg bg-l4">topbar</div>,
      nav: <nav className="background-bg bg-l4">nav</nav>,
      aside: <aside className="background-bg bg-l4">aside</aside>,
      header: <header className="background-bg bg-l4">header</header>,
      main: <main className="background-bg bg-l4">main</main>,
      footer: <footer className="background-bg bg-l4">footer</footer>,
    }
  ];

  return (
    <ResponsiveLayout routes={ routes } />
  )
};

export const WithDefaultComponents = () => {
  const navItems = [
    {
      text: 'Portal',
      icon: RiHome2Line,
      link: {
        to: '/portal'
      }
    },
    {
      text: 'Projects',
      icon: RiBriefcase2Line,
      link: {
        to: '/projects'
      }
    }
  ];

  const routes = [
    {
      path: "/",
      exact: false,
      nav: <Nav items={ navItems } />
    }
  ];

  return (
    <ResponsiveLayout routes={ routes } />
  )
};
