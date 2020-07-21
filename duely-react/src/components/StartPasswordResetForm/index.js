import React, { useState } from 'react';
import { useMutation } from '@apollo/client'
import useAuth from 'hooks/useAuth';
import TextField from 'components/TextField';
import { emailFieldProps } from 'components/TextField/presets';
import Button from 'components/Button';
import Form from 'components/Form';
import { START_PASSWORD_RESET_MUTATION } from 'apollo';

const StartPasswordResetForm = React.forwardRef(({ emailAddress, ...props }, ref) => {
  const [startPasswordReset, { loading: mutationLoading }] = useMutation(START_PASSWORD_RESET_MUTATION);
  const [errorMessage, setErrorMessage] = useState(null);
  const [completed, setCompleted] = useState(null);
  const { loading } = useAuth();

  const handleSubmit = async ({ emailAddress }) => {
    const { error, data: { startPasswordReset: data } = {} } = await startPasswordReset({ variables: {
      emailAddress,
      redirectUrl: `${window.location.origin}/profile?verify=password-reset`,
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
      <h3 className="default f-b mb-2">Password reset</h3>
      <TextField data-form="emailAddress" defaultValue={ emailAddress } { ...emailFieldProps } autoFocus completed={ null } />
      <Button className="my-2" areaWidth="40ch" loading={ loading || mutationLoading } error={ errorMessage } completed={ !!completed } filled prominent color="primary">Reset password</Button>
      <div className="flex row center gap-5">
        <span className="f-2">Don't have an account?</span>
        <Button text color="primary" link={{ to: '/sign-up' }}>Sign up</Button>
      </div>
    </Form>
  );
});

export default StartPasswordResetForm;
