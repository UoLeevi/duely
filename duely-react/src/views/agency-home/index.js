import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { subdomain } from 'routes';
import Choose from 'components/Choose';

const AGENCY_QUERY = gql`
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
    }
  }
`;

const AGENCY_ROLES_QUERY = gql`
  query($agencyUuids: [ID!]) {
    me {
      uuid
      name
      type
      agenciesConnection {
        edges(uuids: $agencyUuids) {
          node {
            uuid
          }
          roles
        }
      }
    }
  }
`;

const AgencyHome = () => {
  const { loading: loadingAgency, error: errorAgencyQuery, data: dataAgencyQuery } = useQuery(AGENCY_QUERY, {
    variables: {
      subdomainName: subdomain,
    }
  });

  const { loading: loadingAgencyRoles, error: errorAgencyRoles, data: dataAgencyRoles } = useQuery(AGENCY_ROLES_QUERY, {
    variables: () => ({
      agencyUuids: [dataAgencyQuery.agency.uuid],
    }),
    skip: loadingAgency
  });

  return (
    <Choose index={ loadingAgency || loadingAgencyRoles ? 0 : 1 }>
      <span>loading</span>
      <span>loaded</span>
    </Choose>
  );
};

export default AgencyHome;
