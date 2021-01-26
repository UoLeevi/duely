import React from 'react';
import { Card, useDynamicNavigation } from '@duely/react';
import {
  agency_stripe_account_update_url_Q,
  current_agency_Q,
  query,
  useQuery
} from '@duely/client';

export function DashboardCardGetStartedEnablePayouts() {
  const { data: agency } = useQuery(current_agency_Q);

  const navigateToStripeAccountUpdate = useDynamicNavigation({
    resolveUrl: async () => {
      const url = await query(agency_stripe_account_update_url_Q, { agency_id: agency!.id });
      if (!url) throw new Error('Unable to get account update URL');
      return url;
    }
  });

  return (
    <Card className="items-center h-full px-10 py-6 space-y-4 text-center">
      <h2 className="text-xl font-medium">Enable payouts</h2>
      <p className="flex-1 text-sm font-medium text-gray-600">
        To receive payouts, set up your payment details at Stripe.
      </p>
      <a
        href="https://connect.stripe.com/setup/c/xxxxxxxxxxxx"
        onClick={navigateToStripeAccountUpdate}
        className="px-6 py-2 font-medium text-white bg-indigo-500 rounded-md shadow-sm"
      >
        Set up payments
      </a>
    </Card>
  );
}
