import { customer_Q, useQuery } from '@duely/client';
import { Card, Form } from '@duely/react';
import { useParams } from 'react-router-dom';
import { DashboardSection } from '../../components';
import { UpdateCustomerBasicInfoForm } from './components';

export default function DashboardCustomersEditCustomer() {
  const { customer_id } = useParams<{ customer_id: string }>();
  const { data: customer, loading: customerLoading } = useQuery(customer_Q, {
    customer_id
  });

  return (
    <>
      <DashboardSection title={customer?.name!} loading={customerLoading}>
        <Card>
          <Form.Section
            title="Basic information"
            description="Name and email address for the customer."
          >
            <UpdateCustomerBasicInfoForm customer_id={customer_id} />
          </Form.Section>
        </Card>
      </DashboardSection>
    </>
  );
}
