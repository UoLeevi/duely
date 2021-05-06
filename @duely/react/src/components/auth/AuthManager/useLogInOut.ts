import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { log_out_M, useMutation } from '@duely/client';
import { produce } from 'immer';

export function useLogInOut() {
  // Get verification code from url query string and replace history entry
  const history = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const shouldLogOut = searchParams.has('log-out');
  const [logOut, { loading: logOutLoading }] = useMutation(log_out_M);
  const loading = shouldLogOut || logOutLoading;

  useEffect(() => {
    if (!shouldLogOut)
      return;

    const searchParams = new URLSearchParams(history.location.search);
    searchParams.delete('log-out');

    const location = produce(history.location, location => {
      const search = '?' + searchParams.toString();
      location.search = search === '?' ? '' : search;
    });

    logOut({});
    history.replace(location);

  }, [history, logOut, shouldLogOut]);

  return { loading }
}
