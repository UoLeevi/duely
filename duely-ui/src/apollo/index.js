import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { onError } from 'apollo-link-error';
import { ApolloLink, split, execute, toPromise } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import gql from 'graphql-tag';
import defaults from './defaults';
import resolvers from './resolvers';


// Get access token from url query string and replace history entry
const url = new URL(window.location.href)
const access_token = url.searchParams.get('access_token');

if (access_token) {
  localStorage.setItem('user-jwt', access_token);
  url.searchParams.delete('access_token');
  window.history.replaceState(window.history.state, document.title, url.toString());
}

const cache = new InMemoryCache({
  dataIdFromObject: object => object.uuid || null
});

cache.writeData({ data: defaults });

const httpLink = new HttpLink({ uri: 'https://api.duely.app/graphql' });

let beginVisitPromise = null;

async function getToken() {
  let token = localStorage.getItem('user-jwt') || localStorage.getItem('visitor-jwt');

  if (token)
    return token;

  if (!beginVisitPromise) {
    beginVisitPromise = toPromise(
      execute(httpLink, {
        query: gql`
          mutation {
            beginVisit {
              success
              message
              jwt
            }
          }
        `
      }))
      .then(({ data }) => {
        if (data.beginVisit.success)
          localStorage.setItem('visitor-jwt', data.beginVisit.jwt);
        else {
          // eslint-disable-next-line
          console.log(data.beginVisit.message);
        }
      });
  }

  await beginVisitPromise;
  return localStorage.getItem('visitor-jwt');
}

const wsClient = new SubscriptionClient('wss://api.duely.app/graphql', {
  reconnect: true,
  lazy: true,
  connectionParams: async () => {
    const token = await getToken();
    return (token
      ? {
            authorization: `Bearer ${token}`
      }
      : {});
  }
});
const wsLink = new WebSocketLink(wsClient);
const transportLink = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const authLink = setContext(async (req, { headers }) => {
  let token = await getToken();

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

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      switch (err.extensions.code) {
        case 'UNAUTHENTICATED':
          // error code is set to UNAUTHENTICATED
          // when AuthenticationError thrown in resolver

          // reset access tokens
          localStorage.removeItem('user-jwt')
          localStorage.removeItem('visitor-jwt')

          // retry the request, returning the new observable
          return forward(operation);
      }
    }
  }

  if (networkError)
    // eslint-disable-next-line
    console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  link: ApolloLink.from([
    errorLink,
    authLink,
    transportLink
  ]),
  cache,
  resolvers,
  connectToDevTools: process.env.NODE_ENV !== 'production'
});

client.onResetStore(() => {
  cache.writeData(defaults);
});

client.onClearStore(() => {
  // Close socket connection which will also unregister subscriptions on the server-side.
  wsClient.close();
  // Reconnect to the server.
  wsClient.connect();
});

export {
  client,
  gql
};