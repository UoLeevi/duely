import { useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { produce } from 'immer';
import { useMutation, verify_sign_up_M } from '@duely/client';

export function useVerificationCode() {
  // Get verification code from url query string and replace history entry
  const history = useHistory();
  const location = useLocation();
  const previousLocationKeyRef = useRef(location.key);
  
  useEffect(() => {
    previousLocationKeyRef.current = location.key;
  }, [location.key]);

  const searchParams = new URLSearchParams(location.search);
  const verify = searchParams.get('verify');
  const verification_code = searchParams.get('verification_code');
  const [verifySignUp, { loading: verifySignUpLoading }] = useMutation(verify_sign_up_M);
  const loadingRef = useRef(false);
  
  if (location.key !== previousLocationKeyRef.current) {
    loadingRef.current = false;
  }

  const loading = loadingRef.current || (verify && verification_code) || verifySignUpLoading;

  useEffect(() => {
    const searchParams = new URLSearchParams(history.location.search);
    searchParams.delete('verify');
    searchParams.delete('verification_code');

    const location = produce(history.location, (location) => {
      const search = '?' + searchParams.toString();
      location.search = search === '?' ? '' : search;
    });

    if (verify && verification_code) {
      switch (verify) {
        case 'password_reset':
          loadingRef.current = true;
          history.replace('/set-new-password', {
            redirectTo: location,
            verification_code
          });
          break;

        case 'sign_up':
          loadingRef.current = true;
          history.replace(location);
          verifySignUp({ verification_code });
          break;

        default:
          // just remove the invalid query parameters
          loadingRef.current = true;
          history.replace(location);
          break;
      }
    }
  }, [history, verify, verification_code, verifySignUp]);

  return { loading };
}
