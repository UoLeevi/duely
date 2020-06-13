import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import LogInForm from './LogInForm';
import LogOutButton from './LogOutButton';

const NavBar = () => {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <nav>
      { isLoggedIn ? <LogOutButton /> : <LogInForm /> }
    </nav>
  );
};

export default NavBar;
