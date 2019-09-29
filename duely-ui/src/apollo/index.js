import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';
import { setContext } from 'apollo-link-context';
import { ApolloLink, execute, toPromise } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
//import { WebSocketLink } from 'apollo-link-ws';
//import { SubscriptionClient } from 'subscriptions-transport-ws';
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

const stateLink = withClientState({
  cache,
  defaults,
  resolvers
});

const httpLink = createHttpLink({ uri: 'https://api.duely.app/graphql' });

let beginVisitPromise = null;

const authLink = setContext(async (req, { headers }) => {
  let token = localStorage.getItem('user-jwt') || localStorage.getItem('visitor-jwt');

  if (!token) {
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
    token = localStorage.getItem('visitor-jwt');
  }

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