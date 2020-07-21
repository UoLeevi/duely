import React, { useState, useEffect } from 'react';
import useAuth from 'hooks/useAuth';
import TextField from 'components/TextField';
import { passwordFieldProps } from 'components/TextField/presets';
import Button from 'components/Button';
import Form from 'components/Form';

const NewPasswordForm = React.forwardRef(({ verificationCode, whenDone = () => {}, ...props }, ref) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [completed, setCompleted] = useState(null);
  const { loading, isLoggedIn, verifyPasswordReset } = useAuth();

  useEffect(() => {
    if (!loading && isLoggedIn) {
      whenDone();
    }
  }, [loading, isLoggedIn, whenDone]);

  const handleSubmit = async ({ password }) => {
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
    <Form className="w-panel" handleSubmit={ handleSubmit } autoComplete="new-password" { ...props } ref={ ref }>
      <h2 className="default f-b mb-2">Set new password</h2>
      <TextField data-form="password" { ...passwordFieldProps } autoFocus />
      <Button className="mt-2" areaWidth="40ch" loading={ loading } error={ errorMessage } completed={ completed } filled color="primary">Change password and log in</Button>
    </Form>
  );
});

export default NewPasswordForm;
