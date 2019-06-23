import auth from '../auth';

export default async function ({ req }) {
  const authorization = req.headers.authorization || null;
  const jwt = (authorization && authorization.startsWith('Bearer ')
    ? authorization.substring(7)
    : null);

  let claims = null;

  if (jwt) {
    try {
      claims = await auth.verify(jwt);
    } catch (e) {
      console.warn(`Unable to authenticate using auth token: ${jwt}`);
    }
  }

  return {
    jwt,
    claims,
  };
}
