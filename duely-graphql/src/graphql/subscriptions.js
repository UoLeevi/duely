import { pool } from '../db';

export default {
  onConnect: (connectionParams, webSocket) => {
    if (!connectionParams.jwt)
      throw new AuthenticationError('Unauthorized');

    console.log(webSocket);

    return {
      jwt
    };
  }
};