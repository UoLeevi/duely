import {
  agency_stripe_account_Q,
  current_subdomain_Q,
  customer_Q,
  customer_subscriptions_Q,
  useQuery
} from '@duely/client';
import {
  Box,
  ColoredChip,
  DropMenu,
  icons,
  PropertyList,
  PropertyValue,
  Query,
  SkeletonText,
  Table,
  useQueryState
} from '@duely/react';
import { ElementType } from '@duely/util';
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

  const {
    data: subscriptions,
    loading: subscriptionsLoading,
    error: subscriptionsError,
    query: subscriptionsQuery
  } = useQuery(customer_subscriptions_Q, {
    customer_id
  });

  type TSubscription = ElementType<ReturnType<typeof customer_subscriptions_Q['result']>>;

  return (
    <>
      <Query state={query} queryKey={query.queryDef}>
        <Box>
          <Box.Heading subheading="Customer" subheadingIcon="user.solid" as="h2" dynamic>
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

        <Box row>
          <Box.Heading as="h3">Subscriptions</Box.Heading>

          <Table
            dense={true}
            wrap={{ md: 6 }}
            loading={subscriptionsLoading}
            error={subscriptionsError}
            items={subscriptions}
            keyField="id"
            rowLink={(subscription: TSubscription) => ({
              to: `/dashboard/orders/subscriptions/${subscription.id}`
            })}
          >
            <Table.Column header="Status">
              {(subscription: TSubscription | null) =>
                !subscription ? (
                  <div className="flex flex-col items-center">
                    <ColoredChip color="gray" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <ColoredChip
                      text={subscription.status}
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
                )
              }
            </Table.Column>

            <Table.Column header="Billing">
              {(subscription: TSubscription | null) =>
                !subscription ? (
                  <div className="flex flex-col items-center">
                    <ColoredChip color="gray" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <ColoredChip
                      text={
                        subscription.collection_method === 'charge_automatically'
                          ? 'auto'
                          : 'manual'
                      }
                      color={{
                        auto: 'gray',
                        manual: 'blue'
                      }}
                    />
                  </div>
                )
              }
            </Table.Column>

            <Table.Column header="Product" span={2}>
              {(subscription: TSubscription | null) => (
                <PropertyValue.Product>
                  {subscription?.items[0]?.price?.product?.id}
                </PropertyValue.Product>
              )}
            </Table.Column>

            <Table.Column header="Price" span={2}>
              {(subscription: TSubscription | null) => (
                <PropertyValue.Price>{subscription?.items[0]?.price}</PropertyValue.Price>
              )}
            </Table.Column>

            <Table.Column header="Created" span={2}>
              {(subscription: TSubscription | null) =>
                !subscription ? (
                  <div className="flex flex-col space-y-2">
                    <SkeletonText className="text-sm" />
                  </div>
                ) : (
                  <PropertyValue.Date>{subscription.created}</PropertyValue.Date>
                )
              }
            </Table.Column>

            <Table.Column shrink>
              {(subscription: TSubscription | null) => {
                if (!subscription) {
                  return (
                    <div className="text-gray-300 animate-pulse">{icons['dots-vertical']}</div>
                  );
                }

                return (
                  <DropMenu>
                    <DropMenu.Item icon={icons.pencil} to={`subscriptions/${subscription.id}/edit`}>
                      Edit
                    </DropMenu.Item>

                    <DropMenu.Item
                      icon={icons.trash}
                      to={'?delete_subscription=' + subscription.id}
                    >
                      Delete
                    </DropMenu.Item>
                  </DropMenu>
                );
              }}
            </Table.Column>
          </Table>
        </Box>
      </Query>
    </>
  );
}
