import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useSetRecoilState } from 'recoil';
import { produce } from 'immer';
import { mutate } from '@/apollo';
import { currentUserQueryRefresher } from '@/auth';

export function useLogInOut() {
  // Get verification code from url query string and replace history entry
  const router = useRouter();
  const shouldLogOut = Object.prototype.hasOwnProperty.call(router.query, 'log-out');
  const resetCurrentUser = useSetRecoilState(currentUserQueryRefresher);

  const logOut = useCallback(async () => {
    const result = await mutate('log_out');

    if (result.success) {
      resetCurrentUser(i => i + 1);
    }
  }, []);

  useEffect(() => {
    if (!shouldLogOut)
      return;

    const query = produce(router.query, state => {
      delete state['log-out'];
    });

    router.replace({ query }, undefined, { shallow: true });
    logOut();

  }, [router, shouldLogOut]);
}
