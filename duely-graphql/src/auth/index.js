import jwt from 'jsonwebtoken';

const secret = process.env.JWTSECRET;

export default {
  async verify(token) {
    return jwt.verify(token, secret);
  },
  async issue(sub) {
    return jwt.sign({
      iss: 'duely.app',
      sub
    },
    secret);
  }
};
