import React from 'react';
import useAuthState from 'hooks/useAuthState';
import TextField from 'components/TextField';
import { passwordFieldProps } from 'components/TextField/presets';
import Button from 'components/Button';
import Form from 'components/Form';

const NewPasswordForm = React.forwardRef(({ verificationCode, ...props }, ref) => {
  const [state, send] = useAuthState();
  const { message } = state.event?.data ?? {};

  return (
    <Form className="w-panel" handleSubmit={ data => send({ type: 'VERIFY_PASSWORD_RESET', verificationCode, ...data }) } autoComplete="new-password" 
      completed={ state.matches('loggedIn') &&
        <div className="flex column center gap-5">
          <span className="f-4 f-b">Password changed successfully</span>
          <span className="f-2 f-b">You are now logged in.</span>
          <Button type="button" link={{ to: '/profile' }} filled color="primary">Continue to profile</Button>
        </div>
       } { ...props } ref={ ref }
      >
      <h3 className="default f-b mb-2" style={{ alignSelf: 'center' }}>Set new password</h3>
      <TextField data-form="password" { ...passwordFieldProps } autoFocus />
      <Button className="mt-2" areaWidth="40ch"
        loading={ state.matches('visitor.verifyPasswordResetLoading') }
        error={ state.matches('visitor.verifyPasswordResetFailed') && (message ?? 'Something went wrong') }
        completed={ state.matches('loggedIn') } filled color="primary"
      >Change password and log in</Button>
    </Form>
  );
});

export default NewPasswordForm;
