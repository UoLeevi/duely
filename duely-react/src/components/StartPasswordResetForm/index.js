import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client'
import useAuth from 'hooks/useAuth';
import TextField from 'components/TextField';
import { emailFieldProps } from 'components/TextField/presets';
import Button from 'components/Button';
import { START_PASSWORD_RESET_MUTATION } from 'apollo';

const StartPasswordResetForm = React.forwardRef(({ whenDone = () => {}, ...props }, ref) => {
  const [startPasswordReset, { loading: mutationLoading, data: mutationData }] = useMutation(START_PASSWORD_RESET_MUTATION);
  const [emailAddress, setEmailAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const { loading, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!loading && isLoggedIn) {
      whenDone();
    }
  }, [loading, isLoggedIn, whenDone]);

  const handleSubmit = async e => {
    e.preventDefault();

    const { error, data: { startPasswordReset: data } = {} } = await startPasswordReset({ variables: {
      emailAddress,
      redirectUrl: `${window.location.origin}/profile?verify=password-reset`,
    }});

    if (error || !data.success) {
      setErrorMessage(error?.message || data.message);
      setTimeout(() => setErrorMessage(null), 4000);
    } else if (data.success) {
      whenDone();
    } else {
      throw new Error();
    }
  }

  return (
    <form className="panel" onSubmit={ handleSubmit } autoComplete="new-password" { ...props } ref={ ref }>
      <div className="panel-row">
        <h3 className="default f-b">Password reset</h3>
      </div>
      <div className="panel-row">
        <TextField { ...emailFieldProps } text={ emailAddress } setText={ setEmailAddress } completed={ null } autoFocus />
      </div>
      <div className="panel-row center-h pt-label-text">
        <Button areaWidth="40ch" loading={ loading || mutationLoading } error={ errorMessage } completed={ mutationData?.startPasswordReset?.success && `Password reset link has been sent to ${emailAddress}` } filled prominent color="primary">Reset password</Button>
      </div>
      <div className="panel-row center-h center-v">
        <div className="panel-cell center-h center-v">
          <div className="flex row center gap-5">
            <span className="f-2">Don't have an account?</span>
            <Button text color="primary" link={{ to: '/sign-up' }}>Sign up</Button>
          </div>
        </div>
      </div>
    </form>
  );
});

export default StartPasswordResetForm;
