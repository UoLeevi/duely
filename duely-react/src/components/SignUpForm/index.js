import React, { useState } from 'react';
import useAuthState from 'hooks/useAuthState';
import TextInput from 'components/TextInput';
import { emailFieldProps, passwordFieldProps } from 'components/TextInput/presets';
import Button from 'components/Button';
import Form from 'components/Form';

const SignUpForm = React.forwardRef(({ ...props }, ref) => {
  const [email_address, setEmailAddress] = useState();
  const [state, send] = useAuthState();

  if (state.matches('loggedIn')) {
    return (
      <div className="flex column center gap-5">
        <span className="f-4 f-b">You are logged in and ready to get started</span>
        <Button link={{ to: '/profile' }} text color="primary">Go to your Profile</Button>
      </div>
    );
  }

  const { message } = state.event?.data ?? {};

  const handleSubmit = async (data) => {
    setEmailAddress(data.email_address);
    send({ type: 'START_SIGN_UP', redirect_url: `${window.location.origin}/profile?verify=sign-up`, ...data });
  }

  return (
    <Form className="w-form" handleSubmit={ handleSubmit } autoComplete="new-password" 
      completed={ state.matches('visitor.startSignUpCompleted') && (
        <div className="flex column center gap-5">
          <span className="f-4 f-b">Please check your inbox</span>
          <span className="f-2 f-b">We've sent an email to { email_address } for confirmation.</span>
          <span>If that's not your email address please try again:</span>
          <Button type="button" onClick={ () => send('CONTINUE') }>Enter another email</Button>
        </div>
      )} { ...props } ref={ ref }
    >
      <h2 className="default f-b mb-2" style={{ alignSelf: 'center' }}>Sign up</h2>
      <TextInput name="name" label="Name" type="text" autoFocus required />
      <TextInput name="email_address" { ...emailFieldProps } completed={ null } />
      <TextInput name="password" { ...passwordFieldProps } completed={ null } />
      <Button className="my-2" areaWidth="40ch"
        loading={ state.matches('visitor.startSignUpLoading') } 
        error={ state.matches('visitor.startSignUpFailed') && (message ?? 'We could\'t send a verification link to this email address') } 
        completed={ state.matches('visitor.startSignUpCompleted') } prominent filled color="primary"
      >Sign up</Button>
      <div className="flex row center gap-5">
        <span className="f-2">Already have an account?</span>
        <Button text color="primary" link={{ to: '/log-in' }}>Log in</Button>
      </div>
    </Form>
  );
});

export default SignUpForm;
