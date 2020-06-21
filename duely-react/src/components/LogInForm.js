import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks';
import TextField from './TextField';
import Choose from './Choose';
import Spinner from './Spinner';

const LogInForm = ({ whenDone }) => {
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const { loading, logIn, logInError, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!loading && isLoggedIn) {
      whenDone();
    }
  }, [loading, isLoggedIn, whenDone]);

  const handleSubmit = async e => {
    e.preventDefault();
    await logIn({ emailAddress, password });
  }

  const buttonAnimations = {
    whileTap: { scale: 0.95 }
  };

  return (
    <form className="panel" key="login-form" onSubmit={ handleSubmit } autoComplete="new-password">
      <div className="panel-row">
        <h2 className="default f-b">Log in</h2>
      </div>
      <div className="panel-row">
        <TextField label="Email" type="email" text={ emailAddress } setText={ setEmailAddress } autoFocus />
      </div>
      <div className="panel-row">
        <TextField label="Password" type="password" text={ password } setText={ setPassword } />
      </div>
      <div className="panel-row center-h space-between pt-label-text">
        <Choose index={ loading ? 1 : 0 }>
          <motion.input type="submit" className="default prominent f-4" value="Log in" { ...buttonAnimations } />
          <Spinner fit spin={ loading } />
        </Choose>
      </div>
      <div className="panel-row center-h center-v">
        <div className="panel-cell center-h center-v">
        <Choose index={ logInError ? 1 : 0 }>
          <div className="row center-v center-h">
            <span className="f-2 mr-0">Don't have an account?</span>
            <motion.input type="button" className="default flat dense ml-1 color-primary" value="Sign up" onClick={ whenDone } { ...buttonAnimations } />
          </div>
          <span className="color-error">{ logInError }</span>
          <span className="size-string">XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</span>
        </Choose>
        </div>
      </div>
    </form>
  );
};

export default LogInForm;
