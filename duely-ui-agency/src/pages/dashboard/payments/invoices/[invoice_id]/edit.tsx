import { invoice_Q, useQuery } from '@duely/client';
import { Card, Form } from '@duely/react';
import { useParams } from 'react-router-dom';
import { useAgency } from '~/pages/dashboard/hooks/useAgency';
import { DashboardSection } from '../../../components';
import { UpdateInvoiceForm } from './components';

export default function DashboardPaymentsEditInvoice() {
  const { invoice_id } = useParams<{ invoice_id: string }>();
  const { agency, stripe_account, loading: agencyLoading, error: agencyError } = useAgency();
  const { data: invoice, loading: invoiceLoading } = useQuery(
    invoice_Q,
    { stripe_account_id: stripe_account?.id!, invoice_id },
    { skip: !stripe_account }
  );
  return (
    <>
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
    </>
  );
}
