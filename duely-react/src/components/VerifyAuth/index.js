import React, { useEffect, useRef } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import useModal from 'hooks/useModal';
import useAuthState from 'hooks/useAuthState';
import NewPasswordForm from 'components/NewPasswordForm';

const VerifyAuth = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const verify = searchParams.get('verify');
  const verificationCode = searchParams.get('verification_code');
  const hideModalRef = useRef();
  const showNewPasswordModal = useModal(<NewPasswordForm verificationCode={ verificationCode } />, { hideModalRef, dismissable: false });
  const [, send] = useAuthState();

  useEffect(() => {
    if (verify && verificationCode) {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete('verify');
      newSearchParams.delete('verification_code');
      debugger;
      setSearchParams(newSearchParams);

      switch (verify) {

        case 'sign-up':
          send({ type: 'VERIFY_SIGN_UP', verificationCode });
          break;

        case 'password-reset':
          showNewPasswordModal();
          break;

        default:
          throw new Error();
      }
    }
  }, [searchParams, setSearchParams, verify, verificationCode, showNewPasswordModal, send])

  return (
    <Outlet />
  );
};

export default VerifyAuth;
