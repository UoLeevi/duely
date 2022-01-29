import { agency_stripe_account_Q, invoice_Q, useQuery } from '@duely/client';
import { Card, Form, Query, useQueryState } from '@duely/react';
import { useParams } from 'react-router-dom';
import { DashboardSection } from '../../../components';
import { UpdateInvoiceForm } from './components';

export default function DashboardPaymentsEditInvoice() {
  const { invoice_id } = useParams<{ invoice_id: string }>();
  const stripeAccountQuery = useQueryState(agency_stripe_account_Q);
  const {
    data: invoice,
    loading: invoiceLoading,
    query: invoiceQuery
  } = useQuery(
    invoice_Q,
    (stripe_account) => ({ stripe_account_id: stripe_account?.id!, invoice_id }),
    { deps: [stripeAccountQuery] }
  );
  return (
    <>
      <Query state={invoiceQuery} queryKey={invoiceQuery.queryDef}>
        <DashboardSection
          title={`Invoice ${invoice?.status === 'draft' ? '(draft)' : invoice?.number}`}
          loading={invoiceLoading}
        >
          <Card>
            <Form.Section
              title="Basic information"
              description="Name and email address for the invoice."
            >
              <UpdateInvoiceForm invoice_id={invoice_id} />
            </Form.Section>
          </Card>
        </DashboardSection>
      </Query>
    </>
  );
}
