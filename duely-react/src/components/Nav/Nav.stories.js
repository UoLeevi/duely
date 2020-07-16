import React from 'react';
import Nav from '../Nav';
import { BsHouse, BsBriefcase, BsFolder, BsLayoutTextWindowReverse } from 'react-icons/bs';

export default {
  title: 'Nav',
  component: Nav,
  parameters: {
    layout: 'fullscreen'
  }
};

const items = [
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
    text: 'Site',
    icon: BsLayoutTextWindowReverse,
    link: {
      to: '/site'
    },
    items: [
      {
        text: 'Site',
        link: {
          to: '/site/theme'
        }
      }
    ]
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
