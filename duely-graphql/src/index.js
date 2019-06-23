import express from 'express';
import cors from 'cors';
import http from 'http';
import { ApolloServer } from 'apollo-server-express';
import schema from './graphql/schema';
import context from './graphql/context';

const apollo = new ApolloServer({ 
  schema,
  context,
  introspection: true,
  playground: true
});

const app = express();
app.use(cors());
apollo.applyMiddleware({ app });

const server = http.createServer(app);
apollo.installSubscriptionHandlers(server);

server.listen({ port: process.env.PORT }, () => {
  console.log(
    '🚀 Server ready at',
    `http://localhost:${process.env.PORT}${apollo.graphqlPath}`
  );
});
