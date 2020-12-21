import express, { Request, Response } from 'express';
import cors from 'cors';
import { GraphQLClient, gql } from 'graphql-request';

const gql_begin_visit = gql`
  mutation {
    begin_visit {
      success
      jwt
      message
    }
  }
`;

const gql_log_in_serviceaccount = gql`
  mutation($password: String!) {
    log_in(email_address: "serviceaccount@duely.app", password: $password) {
      success
      jwt
      message
    }
  }
`;

const gql_image = gql`
  query($image_id: ID!) {
    image(id: $image_id) {
      id
      name
      color
      data
    }
  }
`;

main();

let client: GraphQLClient;

async function main() {
  client = await createGraphQLClient();
  const app = express();
  app.set('trust proxy', true);
  app.use(cors());
  app.get('/asset/:subdomain_name/image/:image_id', get_image);
  app.get('/asset/image/:image_id', get_image);
  app.get('/.well-known/server-health', (req, res) => res.send('ok'));

  app.listen({ port: process.env.PORT }, () => {
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}`);
  });
}

async function createGraphQLClient() {
  const endpoint = 'https://api.duely.app/graphql';
  const client = new GraphQLClient(endpoint);

  const { begin_visit } = await client.request(gql_begin_visit);

  if (!begin_visit.success) {
    throw new Error("Unable to get access token.");
  }

  client.setHeader('authorization', `Bearer ${begin_visit.jwt}`);

  const { log_in } = await client.request(gql_log_in_serviceaccount, { password: process.env.DUELY_SERVICE_ACCOUNT_PASSWORD });

  if (!log_in.success) {
    throw new Error("Unable to get access token.");
  }

  client.setHeader('authorization', `Bearer ${log_in.jwt}`);

  return client;
}

async function get_image(req: Request, res: Response) {
  const requestArgs: [string, { image_id: string }, { authorization: string }?] = [gql_image, { image_id: req.params.image_id }];
  const { access_token } = req.query ?? {};

  if (access_token) {
    requestArgs.push({
      authorization: `Bearer ${access_token}`
    });
  }

  try {
    const { image } = await client.request(...requestArgs);

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

  } catch (error) {
    console.error(error);
    res.sendStatus(404);
    return;
  }
}
