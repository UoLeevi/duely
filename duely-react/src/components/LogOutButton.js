import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const LogOutButton = () => {

  const { logOut, loading } = useContext(AuthContext);

  const handleClick = async e => {
    e.preventDefault();
    await logOut();
  }

  return (
    <input type="button" value="Log out" onClick={ handleClick } />
  );
};

export default LogOutButton;
