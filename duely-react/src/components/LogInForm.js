import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useBreakpoints } from '../hooks';
import TextField from './TextField';
import SpinnerLoader from './SpinnerLoader';

const LogInForm = ({ whenDone }) => {
  const { sm } = useBreakpoints();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const { logIn, loading } = useContext(AuthContext);

  const handleSubmit = async e => {
    // TODO: make component reactive by handling logIn state updates in AuthContext (AuthHook)

    e.preventDefault();
    const { data, error } = await logIn({ emailAddress, password });
    
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
        <TextField label="Email" type="email" text={ emailAddress } setText={ setEmailAddress } />
      </div>
      <div className="panel-row">
        <TextField label="Password" type="password" text={ password } setText={ setPassword } />
      </div>
      { sm
        ? (
          <>
            <div className="panel-row center-v space-between pt-label-text">
              <div className="panel-cell center-v">
              { loading
                ? <SpinnerLoader />
                : <input type="submit" className="default prominent" value="Log in" />
              }
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
              <SpinnerLoader loading={ loading }>
                <input type="submit" className="default prominent" value="Log in" />
              </SpinnerLoader>
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
