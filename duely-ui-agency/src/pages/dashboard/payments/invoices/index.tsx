import { Card, DropMenu, icons, LinkButton } from '@duely/react';
import { DashboardSection } from '../../components';
import { Currency, formatDate } from '@duely/util';
import { Util, Table, SkeletonText, ColoredChip } from '@duely/react';
import { useQuery, agency_stripe_account_invoices_Q, current_agency_Q } from '@duely/client';
import { ConfirmInvoiceDeletionModal } from './components';

const wrap = {
  md: {
    columns: 2,
    spans: [1, 1, 2, 1, 1]
  }
};

export default function DashboardPaymentsInvoices() {
  const { data: agency } = useQuery(current_agency_Q);
  const {
    data: invoices,
    loading,
    error
  } = useQuery(agency_stripe_account_invoices_Q, { agency_id: agency!.id });

  type TInvoice = NonNullable<typeof invoices> extends readonly (infer T)[] ? T : never;

  return (
    <>
      <DashboardSection title="Invoices" actions={
          <div className="flex flex-row justify-end">
            <LinkButton
              dense
              color="indigo"
              to="invoices/new-invoice"
              icon="plus.solid"
              className="text-sm"
            >
              New invoice
            </LinkButton>
          </div>
        }>
        <Card className="max-w-screen-lg">
          <Table items={invoices} dense={true} wrap={wrap} loading={loading} error={error}>
            <Table.Column header="Number">
              {(invoice: TInvoice | null) =>
                !invoice ? (
                  <div className="flex flex-col space-y-2">
                    <SkeletonText className="text-sm" />
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
                      {invoice.number}
                    </span>
                  </div>
                )
              }
            </Table.Column>

            <Table.Column header="Date">
              {(invoice: TInvoice | null) =>
                !invoice ? (
                  <div className="flex flex-col space-y-2">
                    <SkeletonText className="text-sm" />
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
                      {formatDate(invoice.status_transitions?.finalized_at ?? invoice.created)}
                    </span>
                    {invoice.due_date && (
                      <span className="text-xs font-medium text-gray-800 dark:text-gray-300">
                        Due date {formatDate(invoice.due_date)}
                      </span>
                    )}
                  </div>
                )
              }
            </Table.Column>

            <Table.Column header="Customer">
              {(invoice: TInvoice | null) =>
                !invoice ? (
                  <div className="flex flex-col space-y-2">
                    <SkeletonText className="text-sm" />
                    <SkeletonText className="text-xs" />
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-300">
                      {invoice.customer_name ?? invoice.customer_email?.split('@')[0]}
                    </span>
                    <span className="text-xs font-medium text-gray-800 dark:text-gray-300">
                      {invoice.customer_email}
                    </span>
                  </div>
                )
              }
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

            <Table.Column header="Action">
              {(invoice: TInvoice | null) => {
                if (!invoice) {
                  return <SkeletonText />;
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
        </Card>
      </DashboardSection>

      <ConfirmInvoiceDeletionModal />
    </>
  );
}