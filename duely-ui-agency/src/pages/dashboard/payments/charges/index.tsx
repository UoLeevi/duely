import { Card, DropMenu, icons, LinkButton, PropertyValue } from '@duely/react';
import { DashboardSection } from '../../components';
import { Currency, formatCurrency, formatDate } from '@duely/util';
import { Util, Table, SkeletonText, ColoredChip } from '@duely/react';
import { useQuery, agency_stripe_account_charges_Q, current_agency_Q } from '@duely/client';

export default function DashboardPaymentsCharges() {
  const { data: agency } = useQuery(current_agency_Q);
  const {
    data: charges,
    loading,
    error
  } = useQuery(agency_stripe_account_charges_Q, { agency_id: agency!.id });

  type TCharge = NonNullable<typeof charges> extends readonly (infer T)[] ? T : never;

  console.log(charges);

  return (
    <>
      <DashboardSection title="Charges">
        <Card className="max-w-screen-lg">
          <Table
            items={charges}
            dense={true}
            wrap={{ md: 4 }}
            loading={loading}
            error={error}
            keyField="id"
            rowLink={(charge: TCharge) => ({ to: `charges/${charge.id}` })}
          >
            <Table.Column header="Receipt number">
              {(charge: TCharge | null) =>
                !charge ? (
                  <div className="flex flex-col space-y-2">
                    <SkeletonText className="text-sm" />
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
                      {charge.receipt_number}
                    </span>
                  </div>
                )
              }
            </Table.Column>

            <Table.Column header="Date">
              {(charge: TCharge | null) => (
                <PropertyValue.Date>{charge?.created}</PropertyValue.Date>
              )}
            </Table.Column>

            <Table.Column header="Amount">
              {(charge: TCharge | null) =>
                !charge ? (
                  <div className="flex flex-col space-y-2">
                    <SkeletonText className="text-sm" />
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
                      {formatCurrency(charge.amount, charge.currency as Currency)}
                    </span>
                  </div>
                )
              }
            </Table.Column>

            <Table.Column header="Customer" span={{ md: 2 }}>
              {(charge: TCharge | null) => (
                <PropertyValue.Customer>{charge?.customer?.id}</PropertyValue.Customer>
              )}
            </Table.Column>

            <Table.Column header="Status">
              {(charge: TCharge | null) =>
                !charge ? (
                  <div className="flex flex-col items-center">
                    <ColoredChip color="gray" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <ColoredChip
                      text={charge.status ?? '-'}
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
          </Table>
        </Card>
      </DashboardSection>
    </>
  );
}
