import React, { useState } from 'react';
import useAuthState from 'hooks/useAuthState';
import TextField from 'components/TextField';
import { emailFieldProps, passwordFieldProps } from 'components/TextField/presets';
import Button from 'components/Button';
import Form from 'components/Form';

const SignUpForm = React.forwardRef(({ ...props }, ref) => {
  const [emailAddress, setEmailAddress] = useState();
  const [state, send] = useAuthState();
  const { message } = state.event?.data ?? {};

  const handleSubmit = async (data) => {
    setEmailAddress(data.emailAddress);
    send({ type: 'START_SIGN_UP', redirectUrl: `${window.location.origin}/profile?verify=sign-up`, ...data });
  }

  return (
    <Form className="w-panel" handleSubmit={ handleSubmit } autoComplete="new-password" 
      completed={ 
        <div className="flex column center gap-5">
          <span className="f-4 f-b">Please check your inbox</span>
          <span className="f-2 f-b">We've sent an email to { emailAddress } for confirmation.</span>
          <span>If that's not your email address please try again:</span>
          <Button type="button" onClick={ () => send('CONTINUE') }>Enter another email</Button>
        </div>
       } { ...props } ref={ ref }
    >
      <h2 className="default f-b mb-2" style={{ alignSelf: 'center' }}>Sign up</h2>
      <TextField data-form="name" label="Name" type="text" autoFocus required />
      <TextField data-form="emailAddress" { ...emailFieldProps } completed={ null } />
      <TextField data-form="password" { ...passwordFieldProps } completed={ null } />
      <Button className="my-2" areaWidth="40ch"
        loading={ state.matches('visitor.startSignUpLoading') } 
        error={ state.matches('visitor.startSignUpFailed') && (message ?? 'We could\'t send a verification link to this email address') } 
        completed={ state.matches('visitor.startSignUpSuccess') } prominent filled color="primary"
      >Sign up</Button>
    </Form>
  );
});

export default SignUpForm;
