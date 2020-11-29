import express from 'express';
import cors from 'cors';
import http from 'http';
import { ApolloServer } from 'apollo-server-express';
import schema from './graphql/schema';
import context from './graphql/context';
import subscriptions from './graphql/subscriptions';

const apollo = new ApolloServer({ 
  schema,
  context,
  subscriptions,
  introspection: true,
  playground: true
});

const app = express();
app.set('trust proxy', true);
app.use(cors());
apollo.applyMiddleware({
  app,
  bodyParserConfig: {
    limit: '100mb'
  }
});

const server = http.createServer(app);
apollo.installSubscriptionHandlers(server);

server.listen({ port: process.env.PORT }, () => {
  console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${apollo.graphqlPath}`);
  console.log(`🚀 Subscriptions ready at ws://localhost:${process.env.PORT}${apollo.subscriptionsPath}`);
});
