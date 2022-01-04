import { Card, DropMenu, icons, useQueryState } from '@duely/react';
import { DashboardSection } from '../../components';
import { Currency, formatCurrency, formatDate } from '@duely/util';
import { Table, SkeletonText, ColoredChip } from '@duely/react';
import { useQuery, agency_subscriptions_Q, current_agency_Q } from '@duely/client';

export default function DashboardOrdersSubscriptions() {
  const agencyControl = useQueryState(current_agency_Q);
  const {
    data: subscriptions,
    loading,
    error
  } = useQuery(agency_subscriptions_Q, (agency) => ({ agency_id: agency!.id }), {
    deps: [agencyControl]
  });

  type TSubscription = NonNullable<typeof subscriptions> extends readonly (infer T)[] ? T : never;

  console.log(subscriptions);

  return (
    <>
      <DashboardSection title="Subscriptions">
        <Card className="max-w-screen-lg">
          <Table
            items={subscriptions}
            dense={true}
            wrap={{ md: 6 }}
            loading={loading}
            error={error}
            keyField="id"
            rowLink={(subscription: TSubscription) => ({ to: `subscriptions/${subscription.id}` })}
          >
            <Table.Column header="Customer" span={2}>
              {(subscription: TSubscription | null) =>
                !subscription ? (
                  <div className="flex flex-col space-y-1">
                    <SkeletonText className="text-sm" />
                    <SkeletonText className="text-xs" />
                  </div>
                ) : (
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
                      {subscription.customer?.name ?? subscription.customer?.email?.split('@')[0]}
                    </span>
                    <span className="text-xs font-medium text-gray-800 dark:text-gray-300">
                      {subscription.customer?.email}
                    </span>
                  </div>
                )
              }
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
              {(subscription: TSubscription | null) =>
                !subscription ? (
                  <div className="flex flex-col space-y-1">
                    <SkeletonText className="text-sm" />
                  </div>
                ) : (
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
                      {subscription.items[0].price?.product?.name}
                    </span>
                  </div>
                )
              }
            </Table.Column>

            <Table.Column header="Price" span={2}>
              {(subscription: TSubscription | null) =>
                !subscription ? (
                  <div className="flex flex-col space-y-2">
                    <SkeletonText className="text-sm" />
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
                      {formatCurrency(
                        subscription.items[0].price?.unit_amount!,
                        subscription.items[0].price?.currency as Currency
                      )}{' '}
                      /{' '}
                      {subscription.items[0].price?.recurring?.interval_count === 1
                        ? subscription.items[0].price?.recurring?.interval
                        : `${subscription.items[0].price?.recurring?.interval_count} ${subscription.items[0].price?.recurring?.interval}s`}
                    </span>
                  </div>
                )
              }
            </Table.Column>

            <Table.Column header="Created" span={2}>
              {(subscription: TSubscription | null) =>
                !subscription ? (
                  <div className="flex flex-col space-y-2">
                    <SkeletonText className="text-sm" />
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
                      {formatDate(subscription.created, 'mmm d, yyyy, hh:nn', { tz: 'local' })}
                    </span>
                  </div>
                )
              }
            </Table.Column>

            <Table.Column header="Action">
              {(subscription: TSubscription | null) => {
                if (!subscription) {
                  return <SkeletonText />;
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
        </Card>
      </DashboardSection>
    </>
  );
}
