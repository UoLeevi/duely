import React from 'react';
import NavButton from '../NavButton';
import { BsHouse } from 'react-icons/bs';
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
    <NavButton text="Home" link={{ to: '/asdf'  }} icon={ BsHouse } />
  );
};

export const Two = () => {
  return (
    <>
      <NavButton text="Home" link={{ to: '/1'  }} icon={ BsHouse } />
      <NavButton text="Home" link={{ to: '/2'  }} icon={ BsHouse } />
    </>
  );
};
