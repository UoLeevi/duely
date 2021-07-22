import {
  agency_stripe_account_Q,
  agency_stripe_account_update_url_Q,
  count_products_Q,
  current_agency_Q,
  query
} from '@duely/client';
import { DashboardFlexGrid, DashboardSection } from '.';
import { useQuery } from '@duely/client';
import { DashboardGetStartedCard } from './DashboardGetStartedCard';
import { AnchorButton, useDynamicNavigation } from '@duely/react';

export function DashboardGetStartedSection() {
  const { data: agency, loading: agencyLoading } = useQuery(current_agency_Q);

  const { data: count_products, loading: count_productsLoading } = useQuery(
    count_products_Q,
    { filter: { agency_id: agency?.id! } },
    { skip: !agency }
  );
  const { data: stripe_account, loading: stripe_accountLoading } = useQuery(
    agency_stripe_account_Q,
    { agency_id: agency?.id! },
    { skip: !agency }
  );

  const navigateToStripeAccountUpdate = useDynamicNavigation({
    resolveUrl: async () => {
      const url = await query(agency_stripe_account_update_url_Q, { agency_id: agency!.id });
      if (!url) throw new Error('Unable to get account update URL');
      return url;
    }
  });

  const loading = agencyLoading || count_productsLoading || stripe_accountLoading;

  if (loading) {
    return null;
  }

  const bankAccountCreated =
    !stripe_account?.requirements.eventually_due.includes('external_account');
  const stripeAccountVerified = stripe_account?.charges_enabled;
  const productsCreated = (count_products ?? 0) !== 0;

  if (bankAccountCreated && stripeAccountVerified && productsCreated) {
    return null;
  }

  return (
    <DashboardSection title="Get started">
      <DashboardFlexGrid>
        {!stripeAccountVerified && (
          <DashboardGetStartedCard
            title="Stripe onboarding"
            description="To enable charges, provide your identity information using Stripe onboarding."
            button={
              <AnchorButton
                href="https://connect.stripe.com/setup/c/xxxxxxxxxxxx"
                onClick={navigateToStripeAccountUpdate}
                color="indigo"
                className="text-sm"
              >
                Proceed to Stripe
              </AnchorButton>
            }
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-20 h-20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                />
              </svg>
            }
          />
        )}

        {!bankAccountCreated && (
          <DashboardGetStartedCard
            title="Add bank account details"
            description="To receive payouts, add your bank account details."
            to="/dashboard/settings/payments/new-bank-account"
            buttonText="Add bank account"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-20 h-20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                />
              </svg>
            }
          />
        )}

        {productsCreated && (
          <DashboardGetStartedCard
            title="Create products"
            description="Start selling online by creating your first product."
            to="/dashboard/products/new-product"
            buttonText="Create a product"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-20 h-20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            }
          />
        )}
      </DashboardFlexGrid>
    </DashboardSection>
  );
}
