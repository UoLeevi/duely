import React from 'react';
import NavTextButton from '../NavTextButton';
import { MemoryRouter as Router } from 'react-router-dom';

export default {
  title: 'NavTextButton',
  component: NavTextButton,
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
    <NavTextButton text="Home" link={{ to: '/asdf' }} />
  );
};