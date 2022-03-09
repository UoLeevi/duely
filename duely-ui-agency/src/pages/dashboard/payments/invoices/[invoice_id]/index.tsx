import {
  agency_stripe_account_invoiceitems_Q,
  agency_stripe_account_Q,
  current_agency_Q,
  customer_Q,
  invoice_Q,
  useQuery
} from '@duely/client';
import {
  Section,
  PropertyList,
  PropertyValue,
  Query,
  useQueryState} from '@duely/react';
import { useParams } from 'react-router-dom';

export * from './components';
export * from './edit';

export function DashboardPaymentsInvoice() {
  const { invoice_id } = useParams<{ invoice_id: string }>();
  const agencyControl = useQueryState(current_agency_Q);
  const stripeAccountControl = useQueryState(agency_stripe_account_Q);
  const { data: invoice, query: invoiceQuery } = useQuery(
    invoice_Q,
    (stripe_account) => ({
      stripe_account_id: stripe_account?.id!,
      invoice_id
    }),
    {
      deps: [stripeAccountControl]
    }
  );
  const { data: invoiceitems, query: invoiceitemsQuery } = useQuery(
    agency_stripe_account_invoiceitems_Q,
    (agency) => ({
      agency_id: agency?.id!,
      invoice_id: invoice?.id!
    }),
    {
      deps: [agencyControl],
      skip: !invoice
    }
  );

  const { data: customer, query: customerQuery } = useQuery(
    customer_Q,
    (stripe_account) => ({
      stripe_account_id: stripe_account?.id!,
      customer_id: invoice?.customer?.id!
    }),
    {
      deps: [stripeAccountControl],
      skip: !invoice
    }
  );

  return (
    <>
      <Query state={invoiceQuery} queryKey={invoiceQuery.queryDef}>
        <Query state={invoiceitemsQuery} queryKey={invoiceitemsQuery.queryDef}>
          <Query state={customerQuery} queryKey={customerQuery.queryDef}>
            <Section>
              <Section.Heading subheading="Invoice" as="h2" dynamic>
                <div className="flex items-baseline space-x-3">
                  <span>
                    <span>{invoice?.customer_name ?? invoice?.customer_email}</span>
                    <span className="text-xl font-normal text-gray-500"> on </span>
                    <span className="text-xl font-normal text-gray-700">
                      #{invoice?.number ?? '(draft)'}
                    </span>
                  </span>
                </div>
              </Section.Heading>

              <PropertyList col>
                <PropertyList.Item label="Date">
                  <PropertyValue.Date>
                    {invoice?.status_transitions?.finalized_at ?? invoice?.created}
                  </PropertyValue.Date>
                </PropertyList.Item>
                {invoice?.due_date && (
                  <PropertyList.Item label="Due">
                    <PropertyValue.Date>{invoice?.due_date}</PropertyValue.Date>
                  </PropertyList.Item>
                )}
              </PropertyList>
            </Section>

            <Section>
              <Section.Heading as="h3">Invoice details</Section.Heading>

              <PropertyList>
                <PropertyList.Item label="Customer">
                  <PropertyValue.Customer>{invoice?.customer?.id}</PropertyValue.Customer>
                </PropertyList.Item>
                <PropertyList.Item label="ID">
                  <PropertyValue.Id>{invoice?.id}</PropertyValue.Id>
                </PropertyList.Item>
                <PropertyList.Item label="Invoice period">
                  <PropertyValue.DateRange from={invoice?.period_start} to={invoice?.period_end} />
                </PropertyList.Item>
              </PropertyList>
            </Section>
          </Query>
        </Query>
      </Query>
    </>
  );
}
