import { useOnce } from './useOnce';
import { usePromise } from './usePromise';

const reCAPTCHA_site_key = '6LegEasaAAAAACd2R2EmRWV5VpCJ1QHu7QDPq5Oz';

function createFetchToken(siteKey: string, recaptchaScriptLoaded: Promise<React.SyntheticEvent<HTMLScriptElement, Event>>) {
  return (action?: string): Promise<string> => {
    return new Promise(async (resolve) => {
      await recaptchaScriptLoaded;

      (window as any).grecaptcha.ready(() => {
        return (window as any).grecaptcha
          .execute(reCAPTCHA_site_key, { action: action ?? 'submit' })
          .then(function (token: string) {
            resolve(token);
          });
      });
    });
  }
}
export function useRecaptcha(): [
  siteKey: string,
  recaptchaScriptOnLoad: React.ReactEventHandler<HTMLScriptElement>,
  fetchToken: () => Promise<string>
] {
  const [promise, resolve] = usePromise<React.SyntheticEvent<HTMLScriptElement, Event>>();
  const fetchToken = useOnce(() => createFetchToken(reCAPTCHA_site_key, promise));
  return [reCAPTCHA_site_key, resolve, fetchToken];
}
