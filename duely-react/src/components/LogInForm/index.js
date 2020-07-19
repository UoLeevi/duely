import React, { useState, useEffect } from 'react';
import useAuth from 'hooks/useAuth';
import useModal from 'hooks/useModal';
import TextField from 'components/TextField';
import Button from 'components/Button';
import StartPasswordResetForm from 'components/StartPasswordResetForm';

const LogInForm = React.forwardRef(({ whenDone, ...props }, ref) => {
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const { loading, logIn, isLoggedIn } = useAuth();
  const showModal = useModal(<StartPasswordResetForm key="password-reset-form" whenDone={ whenDone } />);

  useEffect(() => {
    if (!loading && isLoggedIn) {
      whenDone();
    }
  }, [loading, isLoggedIn, whenDone]);

  const handleSubmit = async e => {
    e.preventDefault();
    const { error, data } = await logIn({ emailAddress, password });

    if (error || !data.success) {
      setErrorMessage(error?.message || data.message);
      setTimeout(() => setErrorMessage(null), 4000);
    } else if (data.success) {
      whenDone();
    } else {
      throw new Error();
    }
  }

  return (
    <form className="panel" key="login-form" onSubmit={ handleSubmit } autoComplete="new-password" { ...props } ref={ ref }>
      <div className="panel-row">
        <h2 className="default f-b">Log in</h2>
      </div>
      <div className="panel-row">
        <TextField label="Email" type="email" text={ emailAddress } setText={ setEmailAddress } autoFocus />
      </div>
      <div className="panel-row">
        <TextField label="Password" type="password" text={ password } setText={ setPassword } actions={{ 'Reset password': showModal }} />
      </div>
      <div className="panel-row center-h space-between pt-label-text">
        <Button loading={ loading } error={ errorMessage } completed={ isLoggedIn && 'You are logged in' } prominent filled color="primary">Log in</Button>
      </div>
      <div className="panel-row center-h center-v">
        <div className="panel-cell center-h center-v">
          <div className="flex row center gap-5">
            <span className="f-2">Don't have an account?</span>
            <Button text color="primary" link={{ to: '/sign-up' }}>Sign up</Button>
          </div>
        </div>
      </div>
    </form>
  );
});

export default LogInForm;
