import { subdomain_public_Q } from '@duely/client';

export const current_subdomain_Q = {
  ...subdomain_public_Q,
  variables: {
    subdomain_name: resolveSubdomain()
  }
}

function resolveSubdomain() {
  const domain = window.location.hostname.toLowerCase();
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
      const url = new URL(window.location.href);
      let name = url.searchParams.get('subdomain');
      subdomain = name?.toLowerCase() ?? 'test';
    }

    return subdomain;
}
