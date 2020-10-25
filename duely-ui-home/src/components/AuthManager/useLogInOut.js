import { useEffect, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useAtom } from 'jotai';
import { mutate } from 'apollo';
import { currentUserAtom } from 'auth';
import { produce } from 'immer';

export function useLogInOut() {
  // Get verification code from url query string and replace history entry
  const history = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const shouldLogOut = searchParams.has('log-out');
  const [, resetCurrentUser] = useAtom(currentUserAtom);

  const logOut = useCallback(async () => {
    const result = await mutate('log_out');

    if (result.success) {
      await resetCurrentUser();
    }
  }, [resetCurrentUser]);

  useEffect(() => {
    if (!shouldLogOut)
      return;

    const searchParams = new URLSearchParams(history.location.search);
    searchParams.delete('log-out');

    const location = produce(history.location, location => {
      const search = '?' + searchParams.toString();
      location.search = search === '?' ? '' : search;
    });

    logOut();
    history.replace(location);

  }, [history, shouldLogOut, logOut]);
}
