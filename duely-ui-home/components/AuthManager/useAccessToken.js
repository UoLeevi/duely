import { useEffect } from 'react';
import { useRouter } from 'next/router';

export function useAccessToken() {
  // Get access token from url query string and replace history entry
  const router = useRouter();
  const { access_token } = router.query;

  useEffect(() => {
    const { access_token, ...query } = router.query;

    if (!access_token)
      return;

    localStorage.setItem('user-jwt', access_token);
    router.replace({ query }, undefined, { shallow: true });
  }, [router, access_token]);
}
