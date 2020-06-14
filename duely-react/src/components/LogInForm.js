import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const LogInForm = () => {
  const [credentials, setCredentials] = useState({
    emailAddress: '',
    password: ''
  });

  const [errorMessage, setErrorMessage] = useState(null);

  const { logIn, loading } = useContext(AuthContext);

  const handleSubmit = async e => {
    e.preventDefault();
    const { data, error } = await logIn(credentials);
    
    if (error) {
      setErrorMessage(error.message);
    } else if (!data.logIn.success) {
      setErrorMessage(data.logIn.message);
    } else {
      setErrorMessage(null);
    }
  }

  return (
    <form onSubmit={ handleSubmit }>
      <input type="text" onChange={e => setCredentials({ ...credentials, emailAddress: e.target.value })} />
      <input type="password" onChange={e => setCredentials({ ...credentials, password: e.target.value })} />
      <input type="submit" value="Log in" />
      { errorMessage === null ? null : <span>{ errorMessage }</span> }
    </form>
  );
};

export default LogInForm;
