import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useBreakpoints } from '../hooks';

const LogInForm = ({ whenDone }) => {
  const { sm } = useBreakpoints();
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
    <form className="panel" key="login-form" onSubmit={ handleSubmit } autoComplete="new-password">
      <div className="panel-row">
        <h2 className="default f-b">Log in</h2>
      </div>
      <div className="panel-row">
        <label className="default grow-1">
          <span>Email</span>
          <input type="email" onChange={e => setCredentials({ ...credentials, emailAddress: e.target.value })} />
        </label>
      </div>
      <div className="panel-row">
        <label className="default grow-1">
          <span>Password</span>
          <input type="password" onChange={e => setCredentials({ ...credentials, password: e.target.value })} />
        </label>
      </div>
      { sm
        ? (
          <>
            <div className="panel-row center-v space-between pt-label-text">
              <div className="panel-cell center-v">
                <input type="submit" className="default prominent" value="Log in" />
              </div>
              <div className="panel-cell center-v">
                <span className="f-1 mr-0">Don't have an account?</span>
                <input type="button" className="default flat dense ml-1 f-2 color-primary" value="Sign up" onClick={ whenDone } />
              </div>
            </div>
          </>
        )
        : (
          <>
            <div className="panel-row center-h space-between pt-label-text">
              <input type="submit" className="default prominent" value="Log in" />
            </div>
            <div className="panel-row center-h center-v">
              <span className="f-1 mr-0">Don't have an account?</span>
              <input type="button" className="default flat dense ml-1 f-2 color-primary" value="Sign up" onClick={ whenDone } />
            </div>
          </>
        )
      }
      { errorMessage === null ? null : <span>{ errorMessage }</span> }
    </form>
  );
};

export default LogInForm;
