import { AuthenticationError } from 'apollo-server-core';

export default {
  onConnect: (connectionParams, webSocket) => {
    const authorization = connectionParams.authorization || null;
    const jwt = (authorization && authorization.startsWith('Bearer ')
      ? authorization.substring(7)
      : null);

    if (!jwt)
      throw new AuthenticationError('Unauthorized');

    return {
      jwt,
      ip: webSocket.upgradeReq.client.remoteAddress
    };
  }
};