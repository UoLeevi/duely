import React, { useContext } from 'react';
import { useQuery, gql } from '@apollo/client';
import { subdomain } from 'routes';
import Choose from 'components/Choose';

const PORTAL_QUERY = gql`
  query($subdomainName: String) {
    agency(subdomainName: $subdomainName) {
      uuid
      name
      theme {
        uuid
        name
        imageLogo {
          uuid
          name
          data
          color
        }
        imageHero {
          uuid
          name
          data
          color
        }
        colorPrimary
        colorSecondary
        colorAccent
        colorBackground
        colorSurface
        colorError
        colorSuccess
      }
      servicesConnection {
        edges(status: "live") {
          cursor
          node {
            uuid
            name
            status
            steps {
              uuid
              name
              type
            }
          }
        }
      }
    }
  }
`;

const Portal = () => {
  const { loading, error, data } = useQuery(PORTAL_QUERY, {
    variables: {
      subdomainName: subdomain,
    }
  });

  return (
    <Choose index={ loading ? 0 : 1 }>
      <span>loading</span>
      <span>loaded</span>
    </Choose>
  );
};

export default Portal;
