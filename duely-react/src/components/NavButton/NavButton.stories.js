import React from 'react';
import NavButton from '../NavButton';
import { IoIosHome } from 'react-icons/io';
import { MemoryRouter as Router } from 'react-router-dom';

export default {
  title: 'NavButton',
  component: NavButton,
  decorators: [
    Fn => (
      <Router>
        <Fn />
      </Router>
    )
  ]
};

export const Default = () => {
  return (
    <NavButton text="Home" link={{ to: '/'  }} icon={ IoIosHome } />
  )
};
