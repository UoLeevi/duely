import { order_Q, useQuery } from '@duely/client';
import { Card, FormSection } from '@duely/react';
import { useParams } from 'react-router-dom';
import { DashboardSection } from '../../components';

export default function DashboardOrdersEditOrder() {
  const { order_id } = useParams<{ order_id: string }>();
  const { data: order, loading: orderLoading } = useQuery(order_Q, {
    order_id
  });

  return (
    <>
      <DashboardSection title={`Order: ${order?.id!}`} loading={orderLoading}>
        <Card>
          <FormSection
            title="Basic information"
            description="Name and email address for the order."
          >
          </FormSection>
        </Card>
      </DashboardSection>
    </>
  );
}
