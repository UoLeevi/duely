import jwt from 'jsonwebtoken';
import db from '../db';

let secret;

async function updateSecret() {
  const res = await db.query(`
    SELECT j.secret
      FROM jwt_secrets j
      ORDER BY j.created DESC
      LIMIT 1;
    `);

  secret = res.rows[0].secret;
}

export default {
  async verify(token) {
    if (!secret)
      await updateSecret();

    return jwt.verify(token, secret);
  },
  async issue(sub) {
    if (!secret)
      await updateSecret();

    return jwt.sign({
      iss: 'duely.app',
      sub
    },
    secret);
  }
};
