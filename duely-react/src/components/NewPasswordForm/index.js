import React, { useState, useEffect } from 'react';
import useAuth from 'hooks/useAuth';
import TextField from 'components/TextField';
import Choose from 'components/Choose';
import Spinner from 'components/Spinner';

const NewPasswordForm = React.forwardRef(({ verificationCode, whenDone, ...props }, ref) => {
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
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
        <Choose index={ loading ? 1 : errorMessage ? 2 : 0 }>
          <input type="submit" className="default f-3" value="Change password and log in" />
          <Spinner data-choose="fit" spin={ loading } />
          <span className="error">{ errorMessage }</span>
          <span className="size-string">XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</span>
        </Choose>
      </div>
    </form>
  );
});

export default NewPasswordForm;
