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

export const Example = () => {
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
  return (
    <Nav items={ items } />
  )
};
