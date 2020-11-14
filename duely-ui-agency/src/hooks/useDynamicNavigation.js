import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

export function useDynamicNavigation(resolveUrl, { action, target } = {}) {
  const history = useHistory();

  return useCallback(async e => {
    if (e?.preventDefault) e.preventDefault();

    let url = await resolveUrl();

    if (url == null) {
      throw new Error('resolveUrl returned null or undefined');
    }
    
    if (!(url instanceof URL)) {
      url = new URL(url);
    }

    const href = url.toString();

    if (url.host === window.location.host) {
      const to = href.split(url.host)[1];
      history[action ?? 'push'](to);
    } else {
      window.open(href, target ?? '_blank');
    }

  }, [resolveUrl, history, action, target]);
}
