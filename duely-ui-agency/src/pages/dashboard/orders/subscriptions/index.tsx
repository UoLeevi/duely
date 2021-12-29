import { Card, DropMenu, icons } from '@duely/react';
import { DashboardSection } from '../../components';
import { Currency, formatCurrency, formatDate } from '@duely/util';
import { Table, SkeletonText, ColoredChip } from '@duely/react';
import { useQuery, agency_subscriptions_Q } from '@duely/client';
import { useAgency } from '../../hooks/useAgency';

export default function DashboardOrdersSubscriptions() {
  const { agency, stripe_account, loading: agencyLoading, error: agencyError } = useAgency();
  const {
    data: subscriptions,
    loading,
    error
  } = useQuery(agency_subscriptions_Q, { agency_id: agency!.id });

  type TSubscription = NonNullable<typeof subscriptions> extends readonly (infer T)[] ? T : never;

  console.log(subscriptions);

  return (
    <>
      <DashboardSection title="Subscriptions">
        <Card className="max-w-screen-lg">
          <Table
            items={subscriptions}
            dense={true}
            wrap={{ md: 4 }}
            loading={loading}
            error={error}
            keyField="id"
          >
            <Table.Column header="Number">
              {(subscription: TSubscription | null) =>
                !subscription ? (
                  <div className="flex flex-col space-y-2">
                    <SkeletonText className="text-sm" />
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
                      {/* {subscription.number ?? '(draft)'} */}
                    </span>
                  </div>
                )
              }
            </Table.Column>

            <Table.Column header="Start date">
              {(subscription: TSubscription | null) =>
                !subscription ? (
                  <div className="flex flex-col space-y-2">
                    <SkeletonText className="text-sm" />
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
                      {formatDate(subscription.start_date, 'mmm d, yyyy')}
                    </span>
                  </div>
                )
              }
            </Table.Column>

            <Table.Column header="Amount">
              {(subscription: TSubscription | null) =>
                !subscription ? (
                  <div className="flex flex-col space-y-2">
                    <SkeletonText className="text-sm" />
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
                      {formatCurrency(
                        subscription?.latest_invoice?.total!,
                        subscription?.latest_invoice?.currency as Currency
                      )}
                    </span>
                  </div>
                )
              }
            </Table.Column>

            <Table.Column header="Customer" span={{ md: 2 }}>
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
                      text={subscription.status ?? '-'}
                      color={{
                        deleted: 'gray',
                        draft: 'orange',
                        open: 'blue',
                        paid: 'green',
                        uncollectible: 'gray',
                        void: 'gray'
                      }}
                    />
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
