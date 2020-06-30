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


export const Areas = () => {
  const routes = [
    {
      path: "/",
      exact: true,
      topbar: () => <div style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}>topbar</div>,
      nav: () => <nav style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}>nav</nav>,
      aside: () => <aside style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}>aside</aside>,
      header: () => <header style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}>header</header>,
      main: () => <main style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}>main</main>,
      footer: () => <footer style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}>footer</footer>,
    }
  ];

  return (
    <ResponsiveLayout routes={ routes } />
  )
};


export const WithDefaultComponents = () => {
  const routes = [
    {
      path: "/",
      exact: true,
      topbar: () => <div style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}>topbar</div>,
      nav: () => <nav style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}>nav</nav>,
      aside: () => <aside style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}>aside</aside>,
      header: () => <header style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}>header</header>,
      main: () => <main style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}>main</main>,
      footer: () => <footer style={{ backgroundColor: 'var(--color-primary)', color: '#ffffff' }}>footer</footer>
    }
  ];

  return (
    <ResponsiveLayout routes={ routes } />
  )
};
