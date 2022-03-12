import { DropMenu, icons, LinkButton, PropertyValue, Section } from '@duely/react';
import { Currency, formatCurrency } from '@duely/util';
import { Table, SkeletonText, ColoredChip } from '@duely/react';
import { useQuery, agency_stripe_account_invoices_Q, current_agency_Q } from '@duely/client';
import { ConfirmInvoiceDeletionModal } from './components';

export default function DashboardPaymentsInvoices() {
  const { data: agency } = useQuery(current_agency_Q);
  const {
    data: invoices,
    loading,
    error
  } = useQuery(agency_stripe_account_invoices_Q, { agency_id: agency!.id });

  type TInvoice = NonNullable<typeof invoices> extends readonly (infer T)[] ? T : never;

  console.log(invoices);

  return (
    <>
      <Section className="max-w-screen-lg">
        <Section.Heading as="h2">Invoices</Section.Heading>
        <Section.Action>
          <LinkButton
            dense
            color="indigo"
            to="invoices/new-invoice"
            icon="plus.solid"
            className="text-sm"
          >
            Create invoice
          </LinkButton>
        </Section.Action>
        <Table
          items={invoices}
          dense={true}
          wrap={{ md: 4 }}
          loading={loading}
          error={error}
          keyField="id"
          rowLink={(invoice: TInvoice) => ({ to: `invoices/${invoice.id}` })}
        >
          <Table.Column header="Number">
            {(invoice: TInvoice | null) =>
              !invoice ? (
                <div className="flex flex-col space-y-2">
                  <SkeletonText className="text-sm" />
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
                    {invoice.number ?? '(draft)'}
                  </span>
                </div>
              )
            }
          </Table.Column>

          <Table.Column header="Date">
            {(invoice: TInvoice | null) => (
              <PropertyValue.Date>
                {invoice?.status_transitions?.finalized_at ?? invoice?.created}
              </PropertyValue.Date>
            )}
          </Table.Column>

          <Table.Column header="Amount">
            {(invoice: TInvoice | null) =>
              !invoice ? (
                <div className="flex flex-col space-y-2">
                  <SkeletonText className="text-sm" />
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
                    {formatCurrency(invoice.amount_due, invoice.currency as Currency)}
                  </span>
                </div>
              )
            }
          </Table.Column>

          <Table.Column header="Customer" span={{ md: 2 }}>
            {(charge: TInvoice | null) => (
              <PropertyValue.Customer>{charge?.customer?.id}</PropertyValue.Customer>
            )}
          </Table.Column>

          <Table.Column header="Status">
            {(invoice: TInvoice | null) =>
              !invoice ? (
                <div className="flex flex-col items-center">
                  <ColoredChip color="gray" />
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <ColoredChip
                    text={invoice.status ?? '-'}
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

          <Table.Column shrink>
            {(invoice: TInvoice | null) => {
              if (!invoice) {
                return <div className="text-gray-300 animate-pulse">{icons['dots-vertical']}</div>;
              }

              return (
                <DropMenu>
                  <DropMenu.Item icon={icons.pencil} to={`invoices/${invoice.id}/edit`}>
                    Edit
                  </DropMenu.Item>

                  <DropMenu.Item icon={icons.trash} to={'?delete_invoice=' + invoice.id}>
                    Delete
                  </DropMenu.Item>
                </DropMenu>
              );
            }}
          </Table.Column>
        </Table>
      </Section>

      <ConfirmInvoiceDeletionModal />
    </>
  );
}
