import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client'
import { Link } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import TextField from 'components/TextField';
import Choose from 'components/Choose';
import Spinner from 'components/Spinner';
import { START_EMAIL_ADDRESS_VERIFICATION_MUTATION } from 'apollo';

const StartPasswordResetForm = React.forwardRef(({ whenDone, ...props }, ref) => {
  const [emailAddress, setEmailAddress] = useState('');
  const [startEmailAddressVerification, { data: mutationData, loading: mutationLoading, error: mutationError }] = useMutation(START_EMAIL_ADDRESS_VERIFICATION_MUTATION);
  const { loading, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!loading && isLoggedIn) {
      whenDone();
    }
  }, [loading, isLoggedIn, whenDone]);

  const handleSubmit = async e => {
    e.preventDefault();

    await startEmailAddressVerification({ variables: {
      emailAddress,
      redirectUrl: `${window.location.origin}/new-password?email_address=${encodeURIComponent(emailAddress)}`,
      subjectSuffix: 'Set new password',
      message: 'Use link above to set a new password and log in.'
    }});
  }

  return (
    <form className="panel" key="start-password-reset-form" onSubmit={ handleSubmit } autoComplete="new-password" { ...props } ref={ ref }>
      <div className="panel-row">
        <h3 className="default f-b">Password reset</h3>
      </div>
      <div className="panel-row">
        <TextField label="Email" type="email" text={ emailAddress } setText={ setEmailAddress } autoFocus disabled={ mutationData?.startEmailAddressVerification?.success } />
      </div>
      <div className="panel-row center-h space-between pt-label-text">
        <Choose index={ loading || mutationLoading ? 0 : mutationData?.startEmailAddressVerification?.success ? 1 : 2 }>
          <Spinner data-choose="fit" spin={ loading || mutationLoading } />
          <span className="success">A link to set a new password has been set to { emailAddress }</span>
          <input type="submit" className="default prominent f-2" value="Send password reset link" />
        </Choose>
      </div>
      <div className="panel-row center-h center-v">
        <div className="panel-cell center-h center-v">
        <Choose index={ !loading && !mutationLoading && (mutationError || mutationData?.startEmailAddressVerification?.success === false) ? 1 : 0 }>
          <div className="row center-v center-h">
            <span className="f-2 mr-2">Don't have an account?</span>
            <Link className="button text ml-2 primary" to="/create-account">Sign up</Link>
          </div>
          <span className="error">{ mutationError?.message || mutationData?.startEmailAddressVerification?.message }</span>
          <span className="size-string">XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</span>
        </Choose>
        </div>
      </div>
    </form>
  );
});

export default StartPasswordResetForm;
