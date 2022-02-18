import { Box, DropMenu, icons, LinkButton, PropertyValue, useQueryState } from '@duely/react';
import { formatPrice, ElementType } from '@duely/util';
import { Table, SkeletonText, ColoredChip, usePagination2 } from '@duely/react';
import { useQuery, agency_subscriptions_Q, current_agency_Q } from '@duely/client';

export function DashboardOrdersSubscriptions() {
  const agencyControl = useQueryState(current_agency_Q);
  const {
    data: subscriptions,
    loading,
    error
  } = useQuery(agency_subscriptions_Q, (agency) => ({ agency_id: agency!.id }), {
    deps: [agencyControl]
  });

  type TSubscription = ElementType<ReturnType<typeof agency_subscriptions_Q['result']>>;

  const pagination = usePagination2<TSubscription, 'id'>({
    getItems: ({ limit, starting_after }) => {
      const { data, loading, error } = useQuery(
        agency_subscriptions_Q,
        (agency) => ({
          agency_id: agency?.id!,
          limit,
          starting_after: starting_after
        }),
        {
          deps: [agencyControl]
        }
      );

      return { items: data ?? [], loading, error };
    },
    itemsPerPage: 5,
    keyField: 'id'
  });

  console.log(subscriptions);

  return (
    <>
      <Box className="max-w-screen-lg">
        <Box.Heading as="h2">Subscriptions</Box.Heading>
        <Box.Action>
          <LinkButton
            dense
            color="indigo"
            to="subscriptions/new-subscription"
            icon="plus.solid"
            className="text-sm"
          >
            Create subscription
          </LinkButton>
        </Box.Action>
        <Table
          pagination={pagination}
          dense={true}
          wrap={{ md: 6 }}
          loading={loading}
          error={error}
          keyField="id"
          rowLink={(subscription: TSubscription) => ({ to: `subscriptions/${subscription.id}` })}
        >
          <Table.Column header="Customer" span={2}>
            {(subscription: TSubscription | null) => (
              <PropertyValue.Customer>{subscription?.customer?.customer?.id}</PropertyValue.Customer>
            )}
          </Table.Column>

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
                      subscription.collection_method === 'charge_automatically' ? 'auto' : 'manual'
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
                {subscription?.items[0]?.price?.product}
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
                return <div className="text-gray-300 animate-pulse">{icons['dots-vertical']}</div>;
              }

              return (
                <DropMenu>
                  <DropMenu.Item icon={icons.pencil} to={`subscriptions/${subscription.id}/edit`}>
                    Edit
                  </DropMenu.Item>

                  <DropMenu.Item icon={icons.trash} to={'?delete_subscription=' + subscription.id}>
                    Delete
                  </DropMenu.Item>
                </DropMenu>
              );
            }}
          </Table.Column>
        </Table>
      </Box>
    </>
  );
}
