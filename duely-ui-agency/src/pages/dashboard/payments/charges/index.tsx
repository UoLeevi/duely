import { Card, DropMenu, Icon, icons, LinkButton, PropertyValue } from '@duely/react';
import { DashboardSection } from '../../components';
import { Currency, formatCurrency, formatDate } from '@duely/util';
import { Util, Table, SkeletonText, ColoredChip } from '@duely/react';
import { useQuery, agency_stripe_account_charges_Q, current_agency_Q } from '@duely/client';
import { Link } from 'react-router-dom';

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
                  <div className="flex space-x-3">
                    <SkeletonText className="text-sm" />
                  </div>
                ) : (
                  <div className="flex justify-between space-x-3">
                    <span className="text-sm font-mono font-bold min-w-[9ch] text-gray-800 dark:text-gray-300">
                      #{charge.receipt_number}
                    </span>

                    <a
                      className="relative text-xs text-gray-400 focus:outline-none hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-300"
                      href={charge.receipt_url!}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon name="external-link" />
                    </a>
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
