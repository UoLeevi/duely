import React, { useState } from 'react';
import useAuthState from 'hooks/useAuthState';
import TextField from 'components/TextField';
import { emailFieldProps } from 'components/TextField/presets';
import Button from 'components/Button';
import Form from 'components/Form';

const StartPasswordResetForm = React.forwardRef(({ emailAddress: defaultEmailAddress, ...props }, ref) => {
  const [emailAddress, setEmailAddress] = useState(defaultEmailAddress);
  const [state, send] = useAuthState();
  const { message } = state.event?.data ?? {};

  const handleSubmit = async (data) => {
    setEmailAddress(data.emailAddress);
    send({ type: 'START_PASSWORD_RESET', redirectUrl: `${window.location.origin}/profile?verify=password-reset`, ...data });
  }

  return (
    <Form className="w-panel" handleSubmit={ handleSubmit } autoComplete="new-password" 
      completed={ state.matches('visitor.startPasswordResetSuccess') &&
        <div className="flex column center gap-5">
          <span className="f-4 f-b">Please check your inbox</span>
          <span className="f-2 f-b">We've sent an email to { emailAddress } for confirmation.</span>
          <span>If that's not your email address please try again:</span>
          <Button type="button" onClick={ () => send('CONTINUE') }>Enter another email</Button>
        </div>
      } { ...props } ref={ ref }
    >
      <h3 className="default f-b mb-2">Password reset</h3>
      <TextField data-form="emailAddress" defaultValue={ emailAddress } { ...emailFieldProps } autoFocus completed={ null } />
      <Button className="my-2" areaWidth="40ch" 
        loading={ state.matches('visitor.startPasswordResetLoading') } 
        error={ state.matches('visitor.startPasswordResetFailed') && (message ?? 'We could\'t send a password reset link to this email address') } 
        completed={ state.matches('visitor.startPasswordResetSuccess') } filled prominent color="primary">Reset password</Button>
      <div className="flex row center gap-5">
        <span className="f-2">Don't have an account?</span>
        <Button text color="primary" link={{ to: '/sign-up' }}>Sign up</Button>
      </div>
    </Form>
  );
});

export default StartPasswordResetForm;
