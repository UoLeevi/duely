import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const LogInForm = () => {
  const [credentials, setCredentials] = useState({
    emailAddress: '',
    password: ''
  });

  const { logIn, loading, error } = useContext(AuthContext);

  const handleSubmit = e => {
    e.preventDefault();
    logIn(credentials);
  }

  return (
    <form onSubmit={ handleSubmit }>
      <input type="text" onChange={e => setCredentials({ ...credentials, emailAddress: e.target.value })} />
      <input type="password" onChange={e => setCredentials({ ...credentials, password: e.target.value })} />
      <input type="submit" value="Log in" />
      { !error ? null : <span>{ error.message }</span> }
    </form>
  );
};

export default LogInForm;
