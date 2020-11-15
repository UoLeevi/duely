import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

export function useDynamicNavigation({ resolveUrl, passAccessToken, action } = {}) {
  const history = useHistory();

  return useCallback(async e => {
    if (e?.preventDefault) e.preventDefault();

    let url = typeof resolveUrl === 'function'
      ? await resolveUrl()
      : e?.target?.href;

    if (url == null) {
      throw new Error('resolveUrl returned null or undefined');
    }
    
    if (!(url instanceof URL)) {
      url = new URL(url);
      
      if (passAccessToken) {
        const isDuelyDomain = ('.' + url.hostname).endsWith('.duely.app');
        const access_token = localStorage.getItem('user-jwt');

        if (access_token && isDuelyDomain) {
          url.searchParams.set('access_token', access_token);
        }
      }

    }

    const href = url.toString();

    if (url.host === window.location.host) {
      const to = href.split(url.host)[1];
      history[action === 'replace' ? 'replace' : 'push'](to);
    } else {
      window.location[action === 'replace' ? 'replace' : 'assign'](href);
    }

  }, [resolveUrl, passAccessToken, history, action]);
}
