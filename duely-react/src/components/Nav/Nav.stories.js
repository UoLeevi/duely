import React from 'react';
import Nav from '../Nav';
import { IoIosHome, IoIosBriefcase } from 'react-icons/io';
import { MemoryRouter as Router } from 'react-router-dom';

export default {
  title: 'Nav',
  component: Nav,
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
    icon: IoIosHome,
    link: {
      to: '/portal'
    }
  },
  {
    text: 'Projects',
    icon: IoIosBriefcase,
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
    <Nav items={ items } horizontal />
  )
};
