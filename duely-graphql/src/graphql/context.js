export default function ({ req }) {
  const authorization = req.headers.authorization || null;
  const jwt = (authorization && authorization.startsWith('Bearer ')
    ? authorization.substring(7)
    : null);

  //console.log(req.body);

  return {
    ip: req.ip,
    jwt
  };
}
