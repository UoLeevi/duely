import { ApolloClient, HttpLink, InMemoryCache, ApolloLink, toPromise, gql } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { getMainDefinition } from '@apollo/client/utilities';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import typePolicies from './typePolicies';

const endpoint = 'api.duely.app/graphql';
const url_http = `https://${endpoint}`;
const url_ws = `wss://${endpoint}`;

const ssrMode = typeof window === 'undefined';
let getResolvedAccessToken = ssrMode
  ? () => null
  : () => localStorage?.getItem('user-jwt') || localStorage?.getItem('visitor-jwt');

const cache = new InMemoryCache({ typePolicies });
const httpLink = new HttpLink({ uri: url_http });

let getAccessTokenPromise = null;

async function getAccessToken() {
  let token = getResolvedAccessToken();

  if (token)
    return token;

  if (!getAccessTokenPromise) {
    getAccessTokenPromise = toPromise(ApolloLink.execute(httpLink, {
      query: gql`
        mutation {
          begin_visit {
            success
            message
            jwt
          }
        }
      `
    }))
    .then(async ({ data }) => {
      if (data.begin_visit.success) {
        const visit_jwt = data.begin_visit.jwt;

        if (ssrMode) {
          const { data } = await toPromise(ApolloLink.execute(httpLink, {
            query: gql`
              mutation($email_address: String!, $password: String!) {
                log_in(email_address: $email_address, password: $password) {
                  success
                  message
                  jwt
                }
              }
            `,
            variables: {
              email_address: 'serviceaccount@duely.app',
              password: process.env.DUELY_SERVICE_ACCOUNT_PASSWORD
            },
            context: {
              headers: {
                authorization: `Bearer ${visit_jwt}`
              }
            }
          }));

          if (data.log_in.success) {
            token = data.log_in.jwt;
            getResolvedAccessToken = () => token;
          } else {
            // eslint-disable-next-line
            console.error(data.log_in.message);
          }
        } else {
          localStorage.setItem('visitor-jwt', visit_jwt);
        }

      } else {
        throw Error(data.begin_visit.message);
      }
    });
  }

  await getAccessTokenPromise;
  return getResolvedAccessToken();
}

let wsClient = null;

const transportLink = createTransportLink();

function createTransportLink() {
  if (ssrMode) return httpLink;

  wsClient = new SubscriptionClient(url_ws, {
    reconnect: true,
    lazy: true,
    connectionParams: async () => {
      const token = await getAccessToken();
      return token ? { authorization: `Bearer ${token}` } : {};
    }
  });
  const wsLink = new WebSocketLink(wsClient);
  return ApolloLink.split(
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
}

const authLink = setContext(async (req, { headers }) => {
  let token = await getAccessToken();

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
      console.log(err);

      switch (err.extensions.code) {
        case 'UNAUTHENTICATED':
          // error code is set to UNAUTHENTICATED
          // when AuthenticationError thrown in resolver

          if (!ssrMode) {
            // reset access tokens
            localStorage.removeItem('user-jwt');
            localStorage.removeItem('visitor-jwt');
          }

          // retry the request, returning the new observable
          return forward(operation);

        default:
          break;
      }
    }
  }

  if (networkError) {
    throw Error(`[Network error]: ${networkError}`);
  }
});

export const client = new ApolloClient({
  ssrMode,
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
  wsClient?.close();
  // Reconnect to the server.
  wsClient?.connect();
});
