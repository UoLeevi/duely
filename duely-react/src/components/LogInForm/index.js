import React, { useState } from 'react';
import useAuth from 'hooks/useAuth';
import useModal from 'hooks/useModal';
import TextField from 'components/TextField';
import { emailFieldProps, passwordFieldProps } from 'components/TextField/presets';
import Button from 'components/Button';
import Form from 'components/Form';
import StartPasswordResetForm from 'components/StartPasswordResetForm';

const LogInForm = React.forwardRef(({ redirectUrl, ...props }, ref) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const { loading, logIn, isLoggedIn } = useAuth();
  const showModal = useModal(<StartPasswordResetForm />);

  const handleSubmit = async variables => {
    const { error, data } = await logIn(variables, redirectUrl);

    if (error || !data.success) {
      setErrorMessage(error?.message || data.message);
      setTimeout(() => setErrorMessage(null), 4000);
    } else if (!data.success) {
      throw new Error();
    }
  }

  return (
    <Form className="w-panel" handleSubmit={ handleSubmit } { ...props } ref={ ref }>
      <h2 className="default f-b mb-2">Log in</h2>
      <TextField data-form="emailAddress" { ...emailFieldProps } autoFocus completed={ null } />
      <TextField data-form="password" { ...passwordFieldProps } completed={ null } actions={{ 'Reset password': showModal }} />
      <Button className="my-2" areaWidth="40ch" loading={ loading } error={ errorMessage } completed={ isLoggedIn && 'You are now logged in.' } prominent filled color="primary">Log in</Button>
      <div className="flex row center gap-5">
        <span className="f-2">Don't have an account?</span>
        <Button text color="primary" link={{ to: '/sign-up' }}>Sign up</Button>
      </div>
    </Form>
  );
});

export default LogInForm;
