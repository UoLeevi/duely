import gql from 'graphql-tag';

let subdomainName = null;

if (process.env.NODE_ENV === 'production') {
  const names = window.location.hostname.split('.');
  
  if (names.length === 3)
    subdomainName = names[0].toLowerCase();

} else {
  const queryParams = new URLSearchParams(window.location.search);
  let name = queryParams.get('subdomain')

  if (name)
    subdomainName = name.toLowerCase();
}

export default {
  Query: {
    async session(obj, args, context, info) {
      if (!subdomainName)
        return {
          agency: null,
          __typename: 'Session'
        };

      const res = await context.client.query({
        query: gql`
          query($subdomainName: String) {
            agency(subdomainName: $subdomainName) {
              uuid
              name
              subdomain {
                uuid
                name
              }
              servicesConnection {
                edges(status: "live") {
                  cursor
                  node {
                    uuid
                    name
                    status
                    agency {
                      uuid
                      name
                    }
                  }
                }
              }
            }
          }
        `,
        variables: {
          subdomainName
        }
      });

      return {
        agency: res.data.agency && res.data.agency[0],
        __typename: 'Session'
      };
    }
  }
};
