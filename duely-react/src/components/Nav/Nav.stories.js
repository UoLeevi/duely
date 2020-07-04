import React from 'react';
import Nav from '../Nav';
import { RiHome2Line, RiBriefcase2Line } from 'react-icons/ri';
import { MemoryRouter as Router } from 'react-router-dom';

export default {
  title: 'Nav',
  component: Nav,
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

const items = [
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

export const Vertical = () => {
  return (
    <Nav items={ items } />
  )
};

export const Horizontal = () => {
  return (
    <Nav items={ items } layout={{ orientation: 'horizontal' }} />
  )
};
