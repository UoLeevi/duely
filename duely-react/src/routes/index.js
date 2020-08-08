import { match } from 'path-to-regexp';
import duely from './duely';
import agency from './agency';

function pathMatcher(path, options) {
  return match(path, { encode: encodeURI, decode: decodeURIComponent, end: false, ...options });
}

export function matchPath({ path, end }, pathname) {
  return pathMatcher(path, { end })(pathname);
}

function resolveDomain() {
  const url = new URL(window.location.href);
  const domain = url.hostname.toLowerCase();
  let subdomain = null;

  if (process.env.NODE_ENV === 'production') {
    if (domain !== 'duely.app') {
      if (domain.endsWith('.duely.app')) {
        subdomain = domain.slice(0, -'.duely.app'.length);
      } else {
        // TODO: check from database
        throw new Error('Not implemented.');
      }
    }
  } else {
    let name = url.searchParams.get('subdomain');

    if (name) {
      // url.searchParams.delete('subdomain');
      // window.history.replaceState(window.history.state, document.title, url.href);
      subdomain = name.toLowerCase();
    }
  }
  return { domain, subdomain };
}

export const { domain, subdomain } = resolveDomain();
export const routes = subdomain === null ? duely : agency;
