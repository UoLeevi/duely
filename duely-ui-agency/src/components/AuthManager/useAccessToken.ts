import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { produce } from 'immer';

export function useAccessToken() {
  // Get access token from url query string and replace history entry
  const history = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const access_token = searchParams.get('access_token');

  useEffect(() => {
    if (!access_token) return;

    const searchParams = new URLSearchParams(history.location.search);
    searchParams.delete('access_token');

    const location = produce(history.location, (location) => {
      const search = '?' + searchParams.toString();
      location.search = search === '?' ? '' : search;
    });

    localStorage.setItem('user-jwt', access_token);
    history.replace(location);
  }, [history, access_token]);

  return { loading: !!access_token };
}
