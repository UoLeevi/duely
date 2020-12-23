import { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

type useDynamicNavigationArgs = {
  resolveUrl?: () => Promise<string | URL>;
  passAccessToken?: boolean;
  replace?: boolean;
  local?: boolean;
};

function isAnchorElement(target: EventTarget | null | undefined): target is HTMLAnchorElement {
  return (target as any)?.tagName === 'A';
}

export function useDynamicNavigation<T>({
  resolveUrl,
  passAccessToken,
  replace,
  local
}: useDynamicNavigationArgs = {}): React.ReactEventHandler<T> {
  // TODO: async event handler does not work if default is not prevented
  const history = useHistory();

  return useCallback(
    async (e) => {
      const a = isAnchorElement(e?.currentTarget) ? e?.currentTarget : null;
      let url: string | URL | null = null;
      let shouldRelyOnDefault = false;

      if (typeof resolveUrl === 'function') {
        e?.preventDefault();
        url = await resolveUrl();
      } else if (a) {
        url = a.href;
        shouldRelyOnDefault = true;
      } else {
        e?.preventDefault();
      }

      if (url == null) throw new Error('resolveUrl returned null or undefined');

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
        const to = href.split(url.host)[1];
        history[replace ? 'replace' : 'push'](to);
      } else if (a && shouldRelyOnDefault) {
        const originalHref = a.href;
        a.href = href;
        setTimeout(() => (a.href = originalHref), 0);
      } else {
        window.location[replace ? 'replace' : 'assign'](href);
      }
    },
    [resolveUrl, passAccessToken, history, replace]
  );
}
