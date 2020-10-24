import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { produce } from 'immer';
import { mutate } from '@/apollo';
import { signUpVerificationState } from '@/auth';

export function useVerificationCode() {
  // Get verification code from url query string and replace history entry
  const router = useRouter();
  const { verify, verification_code } = router.query;
  const [signUpVerification, setSignUpVerification] = useRecoilState(signUpVerificationState);

  const verifySignUp = useCallback(async verification_code => {
    setSignUpVerification(state => produce(state, state => {
      state.loading = true;
    }));

    const result = await mutate('verify_sign_up', { verification_code });

    setSignUpVerification(state => produce(state, state => {
      state.loading = false;
    }));
  }, [setSignUpVerification]);

  useEffect(() => {
    const { verify, verification_code, ...query } = router.query;

    if (verify && verification_code) {
      switch (verify) {
        case 'password_reset':
          // TODO
          router.replace({ query }, undefined, { shallow: true });
          break;

        case 'sign_up':
          router.replace({ query }, undefined, { shallow: true });
          verifySignUp(verification_code);
          break;

        default:
          // just remove the invalid query parameters
          router.replace({ query }, undefined, { shallow: true });
          break;
      }
    }
  }, [router, verify, verification_code]);
}
