import express from 'express';
import cors from 'cors';
import { graphqlHTTP } from 'express-graphql';
import schema from './graphql/schema';
import { getContext } from './graphql/context';
import expressPlayground from 'graphql-playground-middleware-express';
// import subscriptions from './graphql/subscriptions';

// let's fail fast
process.on('unhandledRejection', up => { throw up; });

const app = express();
app.set('trust proxy', true);
app.use(cors());

app.use(
  '/graphql',
  graphqlHTTP(async (req) => {
    return {
      schema,
      context: getContext(req)
    };
  })
);

app.get('/', expressPlayground({ endpoint: '/graphql' }));
app.get('/.well-known/server-health', (req, res) => res.send('ok'));

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${process.env.PORT}/graphql`);
  // console.log(`🚀 Subscriptions ready at ws://localhost:${process.env.PORT}${apollo.subscriptionsPath}`);
});
