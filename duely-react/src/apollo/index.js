import { ApolloClient, HttpLink, InMemoryCache, ApolloLink, toPromise, gql } from '@apollo/client';
import { WebSocketLink } from '@apollo/link-ws';
import { setContext } from '@apollo/link-context';
import { onError } from '@apollo/link-error';
import { getMainDefinition } from '@apollo/client/utilities';
import { SubscriptionClient } from 'subscriptions-transport-ws';

import typePolicies from './typePolicies';


// Get access token from url query string and replace history entry
const url = new URL(window.location.href);
const access_token = url.searchParams.get('access_token');

if (access_token) {
  localStorage.setItem('user-jwt', access_token);
  url.searchParams.delete('access_token');
  window.history.replaceState(window.history.state, document.title, url.toString());
}

const cache = new InMemoryCache({
  typePolicies
});

const httpLink = new HttpLink({
  uri: 'https://api.duely.app/graphql'
});

let beginVisitPromise = null;

async function getToken() {
  let token = localStorage.getItem('user-jwt') || localStorage.getItem('visitor-jwt');

  if (token)
    return token;

  if (!beginVisitPromise) {
    beginVisitPromise = toPromise(
      ApolloLink.execute(httpLink, {
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
    return token ? { authorization: `Bearer ${token}` } : {};
  }
});
const wsLink = new WebSocketLink(wsClient);
const transportLink = ApolloLink.split(
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
          localStorage.removeItem('user-jwt');
          localStorage.removeItem('visitor-jwt');

          // retry the request, returning the new observable
          return forward(operation);

        default:
          break;
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
  connectToDevTools: process.env.NODE_ENV !== 'production'
});

client.onClearStore(() => {
  // Close socket connection which will also unregister subscriptions on the server-side.
  wsClient.close();
  // Reconnect to the server.
  wsClient.connect();
});

export { client };
export * from './queries';
export * from './mutations';
