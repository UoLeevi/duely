import { order_Q, useQuery } from '@duely/client';
import { Box, ColoredChip, PropertyList, PropertyValue, Query, useQueryState } from '@duely/react';
import { useParams } from 'react-router-dom';

export * from './edit';

export function DashboardOrdersOrder() {
  const { order_id } = useParams<{ order_id: string }>();
  const {
    data: order,
    loading: orderLoading,
    query
  } = useQuery(order_Q, {
    order_id
  });

  return (
    <>
      <Query state={query} queryKey={query.queryDef}>
        <Box>
          <Box.Heading subheading="Order" as="h2" dynamic>
            <div className="flex items-baseline space-x-3">
              <span>
                <span>{order?.customer?.name ?? order?.customer?.email_address}</span>
                <span className="text-xl font-normal text-gray-500"> on </span>
                <span className="text-xl font-normal text-gray-700">
                  {order?.items[0].price?.product?.name}
                </span>
              </span>
              <ColoredChip
                dense
                text={order?.state}
                color={{
                  pending: 'orange',
                  processing: 'orange',
                  processed: 'green',
                  failed: 'red'
                }}
              />
            </div>
          </Box.Heading>

          <PropertyList col>
            <PropertyList.Item label="Date">
              <PropertyValue.Date>{order?.ordered_at}</PropertyValue.Date>
            </PropertyList.Item>
          </PropertyList>
        </Box>

        <Box>
          <Box.Heading as="h3">Order details</Box.Heading>

          <PropertyList>
            <PropertyList.Item label="Customer">
              <PropertyValue.Customer>{order?.customer?.id}</PropertyValue.Customer>
            </PropertyList.Item>
            <PropertyList.Item label="Product">
              <PropertyValue.Product>{order?.items[0].price?.product?.id}</PropertyValue.Product>
            </PropertyList.Item>
            <PropertyList.Item label="ID">
              <PropertyValue.Id>{order?.id}</PropertyValue.Id>
            </PropertyList.Item>
          </PropertyList>
        </Box>
      </Query>
    </>
  );
}
