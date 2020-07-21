import React, { useState } from 'react';
import useAuth from 'hooks/useAuth';
import TextField from 'components/TextField';
import { passwordFieldProps } from 'components/TextField/presets';
import Button from 'components/Button';
import Form from 'components/Form';

const NewPasswordForm = React.forwardRef(({ verificationCode, ...props }, ref) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [completed, setCompleted] = useState(null);
  const { loading, verifyPasswordReset } = useAuth();

  const handleSubmit = async ({ password }) => {
    const { error, data } = await verifyPasswordReset({ verificationCode, password });

    if (error || !data.success) {
      setErrorMessage(error?.message || data.message);
      setTimeout(() => setErrorMessage(null), 4000);
    } else if (data.success) {
      setCompleted(
        <div className="flex column center gap-5">
          <span className="f-4 f-b">Password changed successfully</span>
          <span className="f-2 f-b">You are now logged in.</span>
          <Button type="button" link={{ to: '/profile' }} filled color="primary">Continue to profile</Button>
        </div>
      );
    } else {
      throw new Error();
    }
  }

  return (
    <Form className="w-panel" handleSubmit={ handleSubmit } autoComplete="new-password" completed={ completed } { ...props } ref={ ref }>
      <h2 className="default f-b mb-2">Set new password</h2>
      <TextField data-form="password" { ...passwordFieldProps } autoFocus />
      <Button className="mt-2" areaWidth="40ch" loading={ loading } error={ errorMessage } completed={ !!completed } filled color="primary">Change password and log in</Button>
    </Form>
  );
});

export default NewPasswordForm;
