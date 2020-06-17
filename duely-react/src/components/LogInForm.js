import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const LogInForm = ({ whenDone }) => {
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
      return;
    } else if (!data.logIn.success) {
      setErrorMessage(data.logIn.message);
      return;
    }

    setErrorMessage(null);
    whenDone();
  }

  return (
    <form className="default" key="login-form" onSubmit={ handleSubmit }>
      <input type="text" className="default" onChange={e => setCredentials({ ...credentials, emailAddress: e.target.value })} />
      <input type="password" className="default" onChange={e => setCredentials({ ...credentials, password: e.target.value })} />
      <input type="submit" className="default" value="Log in" />
      <input type="button" className="default flat" value="Cancel" onClick={ whenDone } />
      { errorMessage === null ? null : <span>{ errorMessage }</span> }
    </form>
  );
};

export default LogInForm;
