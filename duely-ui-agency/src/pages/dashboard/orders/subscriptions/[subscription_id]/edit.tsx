import { agency_stripe_account_Q, subscription_Q, useQuery } from '@duely/client';
import { Card, Form, Query, useQueryState } from '@duely/react';
import { useParams } from 'react-router-dom';
import { DashboardSection } from '../../../components';
import { UpdateSubscriptionForm } from './components';

export function DashboardOrdersEditSubscription() {
  const { subscription_id } = useParams<{ subscription_id: string }>();
  const stripeAccountQuery = useQueryState(agency_stripe_account_Q);
  const {
    data: subscription,
    loading: subscriptionLoading,
    query: subscriptionQuery
  } = useQuery(
    subscription_Q,
    (stripe_account) => ({ stripe_account_id: stripe_account?.id!, subscription_id }),
    { deps: [stripeAccountQuery] }
  );
  return (
    <>
      <Query state={subscriptionQuery} queryKey={subscriptionQuery.queryDef}>
        <DashboardSection
          // title={`Subscription ${subscription?.status === 'draft' ? '(draft)' : subscription?.number}`}
          loading={subscriptionLoading}
        >
          <Card>
            <Form.Section
              title="Basic information"
              description="Name and email address for the subscription."
            >
              <UpdateSubscriptionForm subscription_id={subscription_id} />
            </Form.Section>
          </Card>
        </DashboardSection>
      </Query>
    </>
  );
}
