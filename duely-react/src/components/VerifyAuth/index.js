import React, { useEffect, useRef } from 'react';
import Route from 'components/Route';
import useModal from 'hooks/useModal';
import useAppState from 'hooks/useAppState';
import useAuthState from 'hooks/useAuthState';
import Button from 'components/Button';
import NewPasswordForm from 'components/NewPasswordForm';

const VerifyAuth = () => {
  const [state, send] = useAppState();
  const { history } = state.context;
  const searchParams = new URLSearchParams(history.location.search);
  const verify = searchParams.get('verify');
  const verificationCode = searchParams.get('verification_code');
  const hideModalRef = useRef();
  const [, sendAuth] = useAuthState();
  const showNewPasswordModal = useModal(
    <NewPasswordForm 
      verificationCode={ verificationCode }
      completedButton={ <Button type="button" onClick={ hideModalRef.current } filled color="primary">Continue</Button> }
    />, 
    { hideModalRef, dismissable: false }
  );

  useEffect(() => {
    if (verify && verificationCode) {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete('verify');
      newSearchParams.delete('verification_code');

      send({ type: 'MODIFY_LOCATION', location: { search: newSearchParams.toString() } });

      switch (verify) {

        case 'sign-up':
          sendAuth({ type: 'VERIFY_SIGN_UP', verificationCode });
          break;

        case 'password-reset':
          showNewPasswordModal();
          break;

        default:
          throw new Error();
      }
    }
  }, [searchParams, verify, verificationCode, showNewPasswordModal, send, sendAuth])

  return (
    <Route />
  );
};

export default VerifyAuth;
