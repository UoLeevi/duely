import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import ResponsiveLayout from '../ResponsiveLayout';

export default {
  title: 'ResponsiveLayout',
  component: ResponsiveLayout,
  decorators: [
    Fn => (
      <Router>
        <Fn />
      </Router>
    )
  ]
};

const routes = [
  {
    path: "/",
    exact: true,
    nav: () => <div>home!</div>,
    main: () => <h2>Home</h2>
  },
  {
    path: "/bubblegum",
    nav: () => <div>bubblegum!</div>,
    main: () => <h2>Bubblegum</h2>
  },
  {
    path: "/shoelaces",
    nav: () => <div>shoelaces!</div>,
    main: () => <h2>Shoelaces</h2>
  }
];

export const Default = () => {
  return (
    <ResponsiveLayout routes={ routes } />
  )
};
