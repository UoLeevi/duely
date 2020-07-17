import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import useModal from 'hooks/useModal';
import TextField from 'components/TextField';
import Choose from 'components/Choose';
import Spinner from 'components/Spinner';
import StartPasswordResetForm from 'components/StartPasswordResetForm';

const LogInForm = React.forwardRef(({ whenDone, ...props }, ref) => {
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const { loading, logIn, isLoggedIn } = useAuth();
  const showModal = useModal(<StartPasswordResetForm key="password-reset-form" whenDone={ whenDone } />);

  useEffect(() => {
    if (!loading && isLoggedIn) {
      whenDone();
    }
  }, [loading, isLoggedIn, whenDone]);

  const handleSubmit = async e => {
    e.preventDefault();
    const { error, data } = await logIn({ emailAddress, password });

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
    <form className="panel" key="login-form" onSubmit={ handleSubmit } autoComplete="new-password" { ...props } ref={ ref }>
      <div className="panel-row">
        <h2 className="default f-b">Log in</h2>
      </div>
      <div className="panel-row">
        <TextField label="Email" type="email" text={ emailAddress } setText={ setEmailAddress } autoFocus />
      </div>
      <div className="panel-row">
        <TextField label="Password" type="password" text={ password } setText={ setPassword } actions={{ 'Reset password': showModal }} />
      </div>
      <div className="panel-row center-h space-between pt-label-text">
        <Choose index={ loading ? 1 : 0 }>
          <input type="submit" className="default prominent f-4" value="Log in" />
          <Spinner data-choose="fit" spin={ loading } />
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

export default LogInForm;
