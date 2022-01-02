import { agency_stripe_account_Q, subscription_Q, useQuery } from '@duely/client';
import { Box, ColoredChip, PropertyList, PropertyValue, Query, useQueryState } from '@duely/react';
import { useParams } from 'react-router-dom';

export default function DashboardOrdersEditSubscription() {
  const { subscription_id } = useParams<{ subscription_id: string }>();
  const stripeAccountControl = useQueryState(agency_stripe_account_Q);
  const { data: subscription, control } = useQuery(
    subscription_Q,
    (stripe_account) => ({
      stripe_account_id: stripe_account?.id!,
      subscription_id
    }),
    {
      deps: [stripeAccountControl]
    }
  );

  return (
    <>
      <Query control={control}>
        <Box>
          <Box.Heading subheading="Subscription" as="h2" dynamic>
            <div className="flex items-baseline space-x-3">
              <span>
                <span>{subscription?.customer?.name ?? subscription?.customer?.email}</span>
                <span className="text-xl font-normal text-gray-500"> on </span>
                <span className="text-xl font-normal text-gray-700">
                  {subscription?.items[0].price?.product?.name}
                </span>
              </span>
              <ColoredChip
                dense
                text={subscription?.status}
                color={{
                  incomplete: 'gray',
                  incomplete_expired: 'gray',
                  trialing: 'blue',
                  active: 'green',
                  past_due: 'orange',
                  canceled: 'gray',
                  unpaid: 'orange'
                }}
              />
            </div>
          </Box.Heading>

          <PropertyList>
            <PropertyList.Item label="Started">
              <PropertyValue.Date date={subscription?.start_date} />
            </PropertyList.Item>
          </PropertyList>
        </Box>

        <Box>
          <Box.Heading as="h3">Subscription details</Box.Heading>

          <PropertyList>
            <PropertyList.Item label="Customer">
              <PropertyValue>
                {subscription?.customer?.name ?? subscription?.customer?.email}
              </PropertyValue>
            </PropertyList.Item>
            <PropertyList.Item label="Product">
              <PropertyValue>{subscription?.items[0].price?.product?.name}</PropertyValue>
            </PropertyList.Item>
            <PropertyList.Item label="ID">
              <PropertyValue.Id>{subscription?.id}</PropertyValue.Id>
            </PropertyList.Item>
            <PropertyList.Item label="Current period">
              <PropertyValue.DateRange
                from={subscription?.current_period_start}
                to={subscription?.current_period_end}
              />
            </PropertyList.Item>
          </PropertyList>
        </Box>
      </Query>
    </>
  );
}
