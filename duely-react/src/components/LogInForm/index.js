import React, { useState } from 'react';
import useAuthState from 'hooks/useAuthState';
import useModal from 'hooks/useModal';
import TextInput from 'components/TextInput';
import { emailFieldProps, passwordFieldProps } from 'components/TextInput/presets';
import Button from 'components/Button';
import Form from 'components/Form';
import StartPasswordResetForm from 'components/StartPasswordResetForm';

const LogInForm = React.forwardRef(({ redirectUrl, ...props }, ref) => {
  const [emailAddress, setSetEmailAddress] = useState(null);
  const [state, send] = useAuthState();
  const { message } = state.event?.data ?? {};

  const showModal = useModal(<StartPasswordResetForm emailAddress={ emailAddress } />);

  return (
    <Form className="w-panel" handleSubmit={ data => send({ type: 'LOG_IN', ...data }) }
      completed={ state.matches('loggedIn') && (
        <div className="flex column center gap-5">
          <span className="f-4 f-b">You are logged in</span>
          <Button link={{ to: redirectUrl ?? '/profile' }} text color="primary">Continue</Button>
        </div>
      )} { ...props } ref={ ref }
    >
      <h3 className="default f-b mb-2" style={{ alignSelf: 'center' }}>Log in</h3>
      <TextInput name="emailAddress" setValue={ setSetEmailAddress } { ...emailFieldProps } autoFocus completed={ null } />
      <TextInput name="password" { ...passwordFieldProps } completed={ null } actions={{ 'Reset password': showModal }} />
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
