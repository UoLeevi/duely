import { agency_stripe_account_Q, current_subdomain_Q, customer_Q, useQuery } from '@duely/client';
import { Box, ColoredChip, PropertyList, PropertyValue, Query, useQueryState } from '@duely/react';
import { useParams } from 'react-router-dom';

export * from './components';
export * from './edit';

export function DashboardCustomersCustomer() {
  const { customer_id } = useParams<{ customer_id: string }>();

  const { data: current_subdomain } = useQuery(current_subdomain_Q);
  const {
    data: customer,
    loading: customerLoading,
    query
  } = useQuery(customer_Q, {
    customer_id
  });

  return (
    <>
      <Query state={query} queryKey={query.queryDef}>
        <Box>
          <Box.Heading subheading="Customer" as="h2" dynamic>
            <div className="flex items-baseline space-x-3">
              <span>
                <span>{customer?.name}</span>
              </span>
            </div>
          </Box.Heading>
        </Box>

        <Box row>
          <Box.Heading as="h3">Details</Box.Heading>

          <PropertyList>
            <PropertyList.Item label="Name">
              <PropertyValue>{customer?.name}</PropertyValue>
            </PropertyList.Item>
            <PropertyList.Item label="Email address">
              <PropertyValue>{customer?.email_address}</PropertyValue>
            </PropertyList.Item>
            <PropertyList.Item label="ID">
              <PropertyValue.Id>{customer?.id}</PropertyValue.Id>
            </PropertyList.Item>
          </PropertyList>
        </Box>
      </Query>
    </>
  );
}
