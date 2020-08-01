import React from 'react';
import { useQuery } from '@apollo/client';
import queries from 'apollo/queries';
import { subdomain } from 'routes';
import Theme from 'components/Theme';
import Route from 'components/Route';

const AgencyRoot = () => {
  const agencyQuery = useQuery(queries.agency.query, { variables: { subdomainName: subdomain } });
  const agency = queries.agency.result(agencyQuery.data);

  return (
    <Theme theme={ agency.theme }>
      <Route />
    </Theme>
  );
};

export default AgencyRoot;
