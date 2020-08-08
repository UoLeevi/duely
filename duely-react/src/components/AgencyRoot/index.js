import React, { useRef } from 'react';
import { useQuery } from '@apollo/client';
import queries from 'apollo/queries';
import { subdomain } from 'routes';
import useBackgroundColor from 'hooks/useBackgroundColor';
import Theme from 'components/Theme';
import Route from 'components/Route';

const AgencyRoot = React.forwardRef((props, ref) => {
  const defaultRef = useRef();
  ref = ref ?? defaultRef;
  useBackgroundColor(ref, 'l9');
  const agencyQuery = useQuery(queries.agency.query, { variables: { subdomainName: subdomain } });
  const agency = queries.agency.result(agencyQuery.data);

  return (
    <Theme { ...props } theme={ agency.theme } ref={ ref }>
      <Route />
    </Theme>
  );
});

export default AgencyRoot;
