import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';
import { setContext } from 'apollo-link-context';
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import gql from 'graphql-tag';
import defaults from './defaults';
import resolvers from './resolvers';

const cache = new InMemoryCache({
  dataIdFromObject: object => object.uuid || null
});

const stateLink = withClientState({
  cache,
  defaults,
  resolvers
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('jwt');
  // return the headers to the context so httpLink can read them
  return (token
    ? {
      headers: {
        ...headers,
        authorization: `Bearer ${token}`,
      }
    }
    : {});
});

const httpLink = createHttpLink({ uri: 'https://api.duely.app/graphql' });

const client = new ApolloClient({
  link: ApolloLink.from([
    authLink,
    stateLink,
    httpLink
  ]),
  cache
});

client.onResetStore(stateLink.writeDefaults);

export {
  client,
  gql
};