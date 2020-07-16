import React from 'react';
import NavTextButton from '../NavTextButton';

export default {
  title: 'NavTextButton',
  component: NavTextButton
};

export const Default = () => {
  return (
    <NavTextButton text="Home" link={{ to: '/asdf' }} />
  );
};
