import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';
import { setContext } from 'apollo-link-context';
import { ApolloLink, execute, toPromise } from 'apollo-link';
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