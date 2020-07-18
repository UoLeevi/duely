import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client'
import { Link } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import TextField from 'components/TextField';
import Choose from 'components/Choose';
import Spinner from 'components/Spinner';
import { START_PASSWORD_RESET_MUTATION } from 'apollo';

const StartPasswordResetForm = React.forwardRef(({ whenDone, ...props }, ref) => {
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
    <form className="panel" key="start-password-reset-form" onSubmit={ handleSubmit } autoComplete="new-password" { ...props } ref={ ref }>
      <div className="panel-row">
        <h3 className="default f-b">Password reset</h3>
      </div>
      <div className="panel-row">
        <TextField label="Email" type="email" text={ emailAddress } setText={ setEmailAddress } autoFocus disabled={ mutationData?.startPasswordReset?.success } />
      </div>
      <div className="panel-row center-h space-between pt-label-text">
        <Choose index={ loading || mutationLoading ? 0 : mutationData?.startPasswordReset?.success ? 1 : 2 }>
          <Spinner data-choose="fit" spin={ loading || mutationLoading } />
          <p className="success">
            <span>Password reset link has been sent to</span><br />
            <span className="f-b">{ emailAddress }</span>
          </p>
          <input type="submit" className="default prominent f-2" value="Send link to reset password" />
        </Choose>
      </div>
      <div className="panel-row center-h center-v">
        <div className="panel-cell center-h center-v">
        <Choose index={ errorMessage ? 1 : 0 }>
          <div className="row center-v center-h">
            <span className="f-2 mr-2">Don't have an account?</span>
            <Link className="button text ml-2 primary" to="/sign-up">Sign up</Link>
          </div>
          <span className="error">{ errorMessage }</span>
          <span className="size-string">XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</span>
        </Choose>
        </div>
      </div>
    </form>
  );
});

export default StartPasswordResetForm;
