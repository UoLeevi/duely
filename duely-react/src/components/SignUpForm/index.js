import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client'
import useAuth from 'hooks/useAuth';
import TextField from 'components/TextField';
import Choose from 'components/Choose';
import Spinner from 'components/Spinner';
import { START_EMAIL_ADDRESS_VERIFICATION_MUTATION } from 'apollo';

const SignUpForm = React.forwardRef(({ whenDone, className, ...props }, ref) => {
  const [startEmailAddressVerification, { loading: mutationLoading, data: mutationData }] = useMutation(START_EMAIL_ADDRESS_VERIFICATION_MUTATION);
  const [name, setName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const { loading, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!loading && isLoggedIn) {
      whenDone();
    }
  }, [loading, isLoggedIn, whenDone]);

  const handleSubmit = async e => {
    e.preventDefault();

    const { error, data: { startEmailAddressVerification: data } = {} } = await startEmailAddressVerification({ variables: {
      emailAddress,
      redirectUrl: `${window.location.origin}/sign-up?email_address=${encodeURIComponent(emailAddress)}`,
      subjectSuffix: 'Sign up for Duely',
      message: 'Use link above to verify email address and log in.'
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

  className = Array.from(new Set(((className ?? '') + ' panel').split(' '))).join(' ');

  return (
    <form className={ className } onSubmit={ handleSubmit } autoComplete="new-password" { ...props } ref={ ref }>
      <div className="panel-row">
        <TextField label="Name" type="text" text={ name } setText={ setName } autoFocus disabled={ mutationData?.startEmailAddressVerification?.success } />
      </div>
      <div className="panel-row">
        <TextField label="Email" type="email" text={ emailAddress } setText={ setEmailAddress } autoFocus disabled={ mutationData?.startEmailAddressVerification?.success } />
      </div>
      <div className="panel-row">
        <TextField label="Password" type="password" text={ password } setText={ setPassword } autoFocus disabled={ mutationData?.startEmailAddressVerification?.success } />
      </div>
      <div className="panel-row center-h space-between pt-label-text">
        <Choose index={ loading || mutationLoading ? 0 : mutationData?.startEmailAddressVerification?.success ? 1 : errorMessage ? 3 : 2 }>
          <Spinner data-choose="fit" spin={ loading || mutationLoading } />
          <p className="success">
            <span>Email address verification link sent to</span><br />
            <span className="f-b">{ emailAddress }</span>
          </p>
          <input type="submit" className="default prominent f-3 primary" value="Sign up" />
          <span className="error">{ errorMessage }</span>
          <span className="size-string">XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX</span>
        </Choose>
      </div>
    </form>
  );
});

export default SignUpForm;
