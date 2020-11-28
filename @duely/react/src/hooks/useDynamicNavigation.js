import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

export function useDynamicNavigation({ resolveUrl, passAccessToken, action, local } = {}) {
  const history = useHistory();

  return useCallback(async e => {
    const originalHref = e?.currentTarget?.href;

    let url = typeof resolveUrl === 'function'
      ? await resolveUrl()
      : originalHref;

    if (url == null) {
      if (e?.preventDefault) e.preventDefault();
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

    if (local) {
      if (e?.preventDefault) e.preventDefault();
      const to = href.split(url.host)[1];
      history[action === 'replace' ? 'replace' : 'push'](to);
    } else if (e?.currentTarget?.tagName === 'A') {
      const a = e?.currentTarget;
      a.href = href;
      setTimeout(() => a.href = originalHref, 0);
    } else {
      if (e?.preventDefault) e.preventDefault();
      window.location[action === 'replace' ? 'replace' : 'assign'](href);
    }

  }, [resolveUrl, passAccessToken, history, action]);
}
