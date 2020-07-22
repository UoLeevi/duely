import React, { useState } from 'react';
import useAuthState from 'hooks/useAuthState';
import useModal from 'hooks/useModal';
import TextField from 'components/TextField';
import { emailFieldProps, passwordFieldProps } from 'components/TextField/presets';
import Button from 'components/Button';
import Form from 'components/Form';
import StartPasswordResetForm from 'components/StartPasswordResetForm';

const LogInForm = React.forwardRef(({ redirectUrl, ...props }, ref) => {
  const [emailAddress, setSetEmailAddress] = useState(null);
  const [state, send] = useAuthState();
  const { message } = state.event?.data ?? {};

  const showModal = useModal(<StartPasswordResetForm emailAddress={ emailAddress } />);

  return (
    <Form className="w-panel" handleSubmit={ data => send({ type: 'LOG_IN', ...data }) } completed={ state.matches('loggedIn') && 'You are now logged in.' } { ...props } ref={ ref }>
      <h2 className="default f-b mb-2">Log in</h2>
      <TextField data-form="emailAddress" setText={ setSetEmailAddress } { ...emailFieldProps } autoFocus completed={ null } />
      <TextField data-form="password" { ...passwordFieldProps } completed={ null } actions={{ 'Reset password': showModal }} />
      <Button className="my-2" areaWidth="40ch" 
        loading={ state.matches('visitor.logInLoading') }
        error={ state.matches('visitor.logInFailed') && (message ?? 'Wrong email or password') }
        completed={ state.matches('loggedIn') && 'You are now logged in.' } prominent filled color="primary">Log in</Button>
      <div className="flex row center gap-5">
        <span className="f-2">Don't have an account?</span>
        <Button text color="primary" link={{ to: '/sign-up' }}>Sign up</Button>
      </div>
    </Form>
  );
});

export default LogInForm;
