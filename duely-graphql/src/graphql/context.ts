import { IncomingMessage } from 'http';

function parseIp(req: IncomingMessage) {
  const xForwardedFor = req.headers['x-forwarded-for'];

  return (
    (typeof xForwardedFor === 'string' && xForwardedFor.split(',').shift()) ||
    req.socket.remoteAddress
  );
}

export type DuelyQqlContext = {
  ip?: string;
  referer?: string;
  user_agent?: string;
  jwt: string | null;
  cache?: Map<any, any>;
};

export function getContext(req: IncomingMessage): DuelyQqlContext {
  const authorization = req.headers.authorization || null;
  const jwt =
    authorization && authorization.startsWith('Bearer ') ? authorization.substring(7) : null;

  //console.log(req.body);

  return {
    ip: parseIp(req),
    referer: req.headers.referer,
    user_agent: req.headers['user-agent'],
    jwt,
    cache: new Map()
  };
}
