import React from 'react';
import NavButton from '../NavButton';
import { RiHome2Line } from 'react-icons/ri';
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
    <div className="ma-2">
      <NavButton text="Home" link={{ to: '/asdf'  }} icon={ RiHome2Line } />
    </div>
  );
};
