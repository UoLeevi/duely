import React, { useState, useEffect } from 'react';
import useAuth from 'hooks/useAuth';
import TextField from 'components/TextField';
import Button from 'components/Button';

const NewPasswordForm = React.forwardRef(({ verificationCode, whenDone = () => {}, ...props }, ref) => {
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [completed, setCompleted] = useState(null);
  const { loading, isLoggedIn, verifyPasswordReset } = useAuth();

  useEffect(() => {
    if (!loading && isLoggedIn) {
      whenDone();
    }
  }, [loading, isLoggedIn, whenDone]);

  const handleSubmit = async e => {
    e.preventDefault();
    const { error, data } = await verifyPasswordReset({ verificationCode, password });

    if (error || !data.success) {
      setErrorMessage(error?.message || data.message);
      setTimeout(() => setErrorMessage(null), 4000);
    } else if (data.success) {
      setCompleted('Password changed successfully. You are now logged in.');
      whenDone();
    } else {
      throw new Error();
    }
  }

  return (
    <form className="panel" onSubmit={ handleSubmit } autoComplete="new-password" { ...props } ref={ ref }>
      <div className="panel-row">
        <h2 className="default f-b">Set new password</h2>
      </div>
      <div className="panel-row">
        <TextField label="New password" type="password" text={ password } setText={ setPassword } />
      </div>
      <div className="panel-row center-h space-between pt-label-text">
        <Button areaWidth="40ch" loading={ loading } error={ errorMessage } completed={ completed } filled color="primary">Change password and log in</Button>
      </div>
    </form>
  );
});

export default NewPasswordForm;
