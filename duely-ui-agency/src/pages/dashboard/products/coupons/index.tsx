import { Card, DropMenu, icons, LinkButton } from '@duely/react';
import { DashboardSection } from '../../components';
import { Currency, ElementType, formatCurrency, formatDate } from '@duely/util';
import { Util, Table, SkeletonText, ColoredChip } from '@duely/react';
import { useQuery, agency_stripe_account_coupons_Q, current_agency_Q } from '@duely/client';
// import { ConfirmCouponDeletionModal } from './components';

export default function DashboardProductsCoupons() {
  const { data: agency } = useQuery(current_agency_Q);
  const {
    data: coupons,
    loading,
    error
  } = useQuery(agency_stripe_account_coupons_Q, { agency_id: agency!.id });

  type TCoupon = ElementType<typeof coupons>;

  console.log(coupons);

  return (
    <>
      <DashboardSection
        title="Coupons"
        actions={
          <div className="flex flex-row justify-end">
            <LinkButton
              dense
              color="indigo"
              to="coupons/new-coupon"
              icon="plus.solid"
              className="text-sm"
            >
              New coupon
            </LinkButton>
          </div>
        }
      >
        <Card className="max-w-screen-lg">
          <Table
            items={coupons}
            dense={true}
            wrap={{ md: 3 }}
            loading={loading}
            error={error}
            keyField="id"
          >
            <Table.Column header="Name" span={2}>
              {(coupon: TCoupon | null) =>
                !coupon ? (
                  <div className="flex flex-col space-y-2">
                    <SkeletonText className="text-sm" />
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
                      {coupon.name}
                    </span>
                  </div>
                )
              }
            </Table.Column>

            {/* <Table.Column header="Date">
              {(coupon: TCoupon | null) =>
                !coupon ? (
                  <div className="flex flex-col space-y-2">
                    <SkeletonText className="text-sm" />
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
                      {formatDate(coupon.status_transitions?.finalized_at ?? coupon.created, 'mmm d, yyyy')}
                    </span>
                    {coupon.due_date && (
                      <span className="text-xs font-medium text-gray-800 dark:text-gray-300">
                        Due {formatDate(coupon.due_date, 'mmm d, yyyy')}
                      </span>
                    )}
                  </div>
                )
              }
            </Table.Column> */}

            {/* <Table.Column header="Customer" span={{ md: 2 }}>
              {(coupon: TCoupon | null) =>
                !coupon ? (
                  <div className="flex flex-col space-y-2">
                    <SkeletonText className="text-sm" />
                    <SkeletonText className="text-xs" />
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
                      {coupon.customer_name ?? coupon.customer_email?.split('@')[0]}
                    </span>
                    <span className="text-xs font-medium text-gray-800 dark:text-gray-300">
                      {coupon.customer_email}
                    </span>
                  </div>
                )
              }
            </Table.Column> */}

            <Table.Column header="Amount or percent">
              {(coupon: TCoupon | null) =>
                !coupon ? (
                  <div className="flex flex-col space-y-2">
                    <SkeletonText className="text-sm" />
                  </div>
                ) : coupon.amount_off ? (
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
                      {formatCurrency(coupon.amount_off, coupon.currency as Currency)}
                    </span>
                  </div>
                ) : coupon.percent_off ? (
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
                      {`${coupon.percent_off} %`.trim()}
                    </span>
                  </div>
                ) : null
              }
            </Table.Column>

            <Table.Column header="Status">
              {(coupon: TCoupon | null) =>
                !coupon ? (
                  <div className="flex flex-col items-center">
                    <ColoredChip color="gray" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <ColoredChip
                      text={coupon.valid ? 'valid' : 'inactive'}
                      color={{
                        valid: 'green',
                        inactive: 'gray'
                      }}
                    />
                  </div>
                )
              }
            </Table.Column>

            <Table.Column header="Action">
              {(coupon: TCoupon | null) => {
                if (!coupon) {
                  return <SkeletonText />;
                }

                return (
                  <DropMenu>
                    <DropMenu.Item icon={icons.pencil} to={`coupons/${coupon.id}/edit`}>
                      Edit
                    </DropMenu.Item>

                    <DropMenu.Item icon={icons.trash} to={'?delete_coupon=' + coupon.id}>
                      Delete
                    </DropMenu.Item>
                  </DropMenu>
                );
              }}
            </Table.Column>
          </Table>
        </Card>
      </DashboardSection>

      {/* <ConfirmCouponDeletionModal /> */}
    </>
  );
}
