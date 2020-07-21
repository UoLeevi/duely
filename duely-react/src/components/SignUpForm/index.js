import React, { useState } from 'react';
import { useMutation } from '@apollo/client'
import useAuth from 'hooks/useAuth';
import TextField from 'components/TextField';
import { emailFieldProps, passwordFieldProps } from 'components/TextField/presets';
import Button from 'components/Button';
import Form from 'components/Form';
import { START_SIGN_UP_MUTATION } from 'apollo';

const SignUpForm = React.forwardRef(({ ...props }, ref) => {
  const [startSignUp, { loading: mutationLoading, data: mutationData }] = useMutation(START_SIGN_UP_MUTATION);
  const [errorMessage, setErrorMessage] = useState(null);
  const [completed, setCompleted] = useState(null);
  const { loading } = useAuth();

  const handleSubmit = async ({ emailAddress, password, name }) => {
    const { error, data: { startSignUp: data } = {} } = await startSignUp({ variables: {
      emailAddress,
      password,
      name,
      redirectUrl: `${window.location.origin}/profile?verify=sign-up`,
    }});

    if (error || !data.success) {
      setErrorMessage(error?.message || data.message);
      setTimeout(() => setErrorMessage(null), 4000);
    } else if (data.success) {
      setCompleted(
        <div className="flex column center gap-5">
          <span className="f-4 f-b">Please check your inbox</span>
          <span className="f-2 f-b">We've sent an email to { emailAddress } for confirmation.</span>
          <span>If that's not your email address please try again:</span>
          <Button type="button" onClick={ () => setCompleted(null) }>Enter another email</Button>
        </div>
      );
    } else {
      throw new Error();
    }
  }

  return (
    <Form className="w-panel" handleSubmit={ handleSubmit } autoComplete="new-password" completed={ completed } { ...props } ref={ ref }>
      <h2 className="default f-b mb-2" style={{ alignSelf: 'center' }}>Sign up</h2>
      <TextField data-form="name" label="Name" type="text" autoFocus disabled={ mutationData?.startSignUp?.success } required />
      <TextField data-form="emailAddress" { ...emailFieldProps } completed={ null } />
      <TextField data-form="password" { ...passwordFieldProps } completed={ null } />
      <Button className="my-2" areaWidth="40ch" loading={ loading || mutationLoading } error={ errorMessage } completed={ !!completed } prominent filled color="primary">Sign up</Button>
    </Form>
  );
});

export default SignUpForm;
