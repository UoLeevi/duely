import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client'
import useAuth from 'hooks/useAuth';
import TextField from 'components/TextField';
import { emailFieldProps, passwordFieldProps } from 'components/TextField/presets';
import Button from 'components/Button';
import Form from 'components/Form';
import { START_SIGN_UP_MUTATION } from 'apollo';

const SignUpForm = React.forwardRef(({ whenDone = () => {}, className, ...props }, ref) => {
  const [startSignUp, { loading: mutationLoading, data: mutationData }] = useMutation(START_SIGN_UP_MUTATION);
  const [errorMessage, setErrorMessage] = useState(null);
  const [completedMessage, setCompletedMessage] = useState(null);
  const { loading, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!loading && isLoggedIn) {
      whenDone();
    }
  }, [loading, isLoggedIn, whenDone]);

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
      setCompletedMessage(`Password reset link has been sent to ${emailAddress}`);
      whenDone();
    } else {
      throw new Error();
    }
  }

  className = Array.from(new Set(((className ?? '') + ' panel').split(' '))).join(' ');

  return (
    <Form className="w-panel" handleSubmit={ handleSubmit } autoComplete="new-password" { ...props } ref={ ref }>
      <h2 className="default f-b mb-2" style={{ alignSelf: 'center' }}>Sign up</h2>
      <TextField data-form="name" label="Name" type="text" autoFocus disabled={ mutationData?.startSignUp?.success } required />
      <TextField data-form="emailAddress" { ...emailFieldProps } autoFocus completed={ null } />
      <TextField data-form="password" { ...passwordFieldProps } completed={ null } />
      <Button className="my-2" areaWidth="40ch" loading={ loading || mutationLoading } error={ errorMessage } completed={ completedMessage } prominent filled color="primary">Sign up</Button>
    </Form>
  );
});

export default SignUpForm;
