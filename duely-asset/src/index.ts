import express, { Request, Response } from 'express';
import cors from 'cors';
import { IncomingMessage } from 'http';
import { beginVisit, endVisit, queryResource } from '@duely/db';

main();

async function main() {
  const app = express();
  app.set('port', process.env.PORT ?? 3000);
  app.set('trust proxy', true);
  app.use(cors());
  app.get('/asset/:subdomain_name/image/:image_id', get_image);
  app.get('/asset/image/:image_id', get_image);
  app.get('/.well-known/server-health', (req, res) => res.send('ok'));

  app.listen({ port: app.get('port') }, () => {
    console.log(`🚀 Server ready at http://localhost:${app.get('port')}`);
  });
}

async function get_image(req: Request, res: Response) {
  const image_id = req.params.image_id;
  const ip = parseIp(req);
  const { access_token } = req.query ?? {};
  let visit_jwt: string | undefined = undefined;
  let jwt: string;

  if (access_token && typeof access_token === 'string') {
    jwt = access_token;
  } else {
    visit_jwt = await beginVisit();
    jwt = visit_jwt;
  }

  const context = {
    jwt,
    ip
  };

  try {
    const image = await queryResource(context, 'image', image_id);

    if (!image) {
      res.sendStatus(404);
      return;
    }

    const [info, data] = image.data.split(',');
    // info = data:${mimeType};base64
    const mimeType = info.slice(5, -7);
    const buffer = Buffer.from(data, 'base64');
    res.setHeader('content-type', mimeType);
    res.send(buffer);
  } catch (err: any) {
    console.error(err);
    res.sendStatus(404);
  } finally {
    if (visit_jwt) {
      await endVisit(context);
    }
  }
}

function parseIp(req: IncomingMessage) {
  const xForwardedFor = req.headers['x-forwarded-for'];

  return (
    (typeof xForwardedFor === 'string' && xForwardedFor.split(',').shift()) ||
    req.socket.remoteAddress
  );
}
