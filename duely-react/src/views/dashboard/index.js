import React, { useContext } from 'react';
import { useQuery, gql } from '@apollo/client';
import { DomainContext } from '../../contexts/DomainContext';
import Choose from '../../components/Choose';

const DASHBOARD_QUERY = gql`
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
        edges {
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
      subjectsConnection {
        edges {
          cursor
          roles
          node {
            uuid
            name
            emailAddress
          }
        }
      }
    }
  }
`;

const Dashboard = () => {

  const { subdomain } = useContext(DomainContext);
  const { loading, error, data } = useQuery(DASHBOARD_QUERY, {
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

export default Dashboard;
