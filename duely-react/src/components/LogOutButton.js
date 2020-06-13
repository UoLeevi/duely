import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const LogOutButton = () => {

  const { logOut, loading, error } = useContext(AuthContext);

  const handleClick = e => {
    e.preventDefault();
    logOut();
  }

  return (
    <input type="button" value="Log out" onClick={ handleClick } />
  );
};

export default LogOutButton;
