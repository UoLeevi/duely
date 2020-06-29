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
    topbar: {
      props: { style: { backgroundColor: 'var(--color-primary)', color: '#ffffff' } },
      component: () => <div>topbar</div>
    },
    nav: {
      props: { style: { backgroundColor: 'var(--color-secondary)', color: '#ffffff' } },
      component: () => <div>nav</div>
    },
    aside: {
      props: { style: { backgroundColor: 'var(--color-error)', color: '#ffffff' } },
      component: () => <div>aside</div>
    },
    header: {
      props: { style: { backgroundColor: 'var(--color-accent)', color: '#ffffff' } },
      component: () => <div>header</div>
    },
    main: {
      props: { style: { backgroundColor: 'var(--color-success)', color: '#ffffff' } },
      component: () => <div>main</div>
    },
    footer: {
      props: { style: { backgroundColor: 'var(--color-surface)', color: '#ffffff' } },
      component: () => <div>footer</div>
    },
  }
];

export const Default = () => {
  return (
    <ResponsiveLayout routes={ routes } />
  )
};
