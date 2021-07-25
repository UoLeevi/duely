import express from 'express';
import cors from 'cors';
import { graphqlHTTP } from 'express-graphql';
import schema from './graphql/schema';
import { getContext } from './graphql/context';
import expressPlayground from 'graphql-playground-middleware-express';
import { GraphQLError } from 'graphql';
import { getDbErrorCode } from '@duely/db';
// import subscriptions from './graphql/subscriptions';

// let's fail fast
process.on('unhandledRejection', (up) => {
  throw up;
});

const app = express();
app.set('port', process.env.PORT ?? 3000);
app.set('trust proxy', true);
app.use(cors());
app.use(express.json({ limit: '8mb' }));
app.use(
  '/graphql',
  graphqlHTTP(async (req) => {
    return {
      schema,
      context: getContext(req),
      customFormatErrorFn(error: GraphQLError) {
        const message = error.message ?? 'An unknown error occurred.';
        const locations = error.locations;
        const path = error.path;
        let extensions = error.extensions;
        const dbErrorCode = error.originalError && getDbErrorCode(error.originalError);

        switch (dbErrorCode) {
          case 'duely__invalid_jwt':
          case 'duely__no_active_session':
            extensions = {
              ...extensions,
              code: 'UNAUTHENTICATED'
            };
            break;

          case 'duely__unauthorized':
            extensions = {
              ...extensions,
              code: 'FORBIDDEN'
            };
            break;
        }

        return extensions ? { message, locations, path, extensions } : { message, locations, path };
      }
    };
  })
);

app.get('/', expressPlayground({ endpoint: '/graphql' }));
app.get('/.well-known/server-health', (req, res) => res.send('ok'));

app.listen(app.get('port'), () => {
  console.log(`🚀 Server ready at http://localhost:${app.get('port')}/graphql`);
  // console.log(`🚀 Subscriptions ready at ws://localhost:${app.get('port')}${apollo.subscriptionsPath}`);
});
