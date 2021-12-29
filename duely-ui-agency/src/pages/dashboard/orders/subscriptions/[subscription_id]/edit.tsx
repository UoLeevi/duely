import { subscription_Q, useQuery } from '@duely/client';
import { Card, Form } from '@duely/react';
import { useParams } from 'react-router-dom';
import { useAgency } from '~/pages/dashboard/hooks/useAgency';
import { DashboardSection } from '../../../components';

export default function DashboardOrdersEditSubscription() {
  const { subscription_id } = useParams<{ subscription_id: string }>();
  const { agency, stripe_account, loading: agencyLoading, error: agencyError } = useAgency();
  const { data: subscription, loading: subscriptionLoading } = useQuery(
    subscription_Q,
    {
      stripe_account_id: stripe_account?.id!,
      subscription_id
    },
    {
      skip: !stripe_account
    }
  );

  return (
    <>
      <DashboardSection title={`Subscription: ${subscription?.id!}`} loading={subscriptionLoading}>
        <Card>
          <Form.Section title="Basic information"></Form.Section>
        </Card>
      </DashboardSection>
    </>
  );
}
