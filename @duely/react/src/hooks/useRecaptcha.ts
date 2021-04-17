import { useOnce } from './useOnce';
import { useScript } from './useScript';

const reCAPTCHA_site_key = '6LegEasaAAAAACd2R2EmRWV5VpCJ1QHu7QDPq5Oz';

function createFetchToken(recaptchaScriptLoaded: Promise<Event>) {
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

export function useRecaptcha(): () => Promise<string> {
  const promise = useScript(`https://www.google.com/recaptcha/api.js?render=${reCAPTCHA_site_key}`);
  return useOnce(() => createFetchToken(promise));
}
