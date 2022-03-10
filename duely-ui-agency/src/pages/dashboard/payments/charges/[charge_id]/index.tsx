import {
  agency_stripe_account_Q,
  customer_Q,
  charge_Q,
  useQuery
} from '@duely/client';
import { Section, PropertyList, PropertyValue, Query, useQueryState } from '@duely/react';
import { useParams } from 'react-router-dom';

export function DashboardPaymentsCharge() {
  const { charge_id } = useParams<{ charge_id: string }>();
  const stripeAccountControl = useQueryState(agency_stripe_account_Q);
  const { data: charge, query: chargeQuery } = useQuery(
    charge_Q,
    (stripe_account) => ({
      stripe_account_id: stripe_account?.id!,
      charge_id
    }),
    {
      deps: [stripeAccountControl]
    }
  );

  const { data: customer, query: customerQuery } = useQuery(
    customer_Q,
    (stripe_account) => ({
      stripe_account_id: stripe_account?.id!,
      customer_id: charge?.customer?.id!
    }),
    {
      deps: [stripeAccountControl],
      skip: !charge
    }
  );

  return (
    <>
      <Query state={chargeQuery} queryKey={chargeQuery.queryDef}>
        <Query state={customerQuery} queryKey={customerQuery.queryDef}>
          <Section>
            <Section.Heading subheading="Charge" as="h2" dynamic>
              <div className="flex items-baseline space-x-3">
                <span>
                  <span className="text-xl font-normal text-gray-700">
                    #{charge?.receipt_number}
                  </span>
                </span>
              </div>
            </Section.Heading>

            <PropertyList col>
              <PropertyList.Item label="Date">
                <PropertyValue.Date>
                  {charge?.created}
                </PropertyValue.Date>
              </PropertyList.Item>
            </PropertyList>
          </Section>

          <Section>
            <Section.Heading as="h3">Charge details</Section.Heading>

            <PropertyList>
              <PropertyList.Item label="Customer">
                <PropertyValue.Customer>{charge?.customer?.id}</PropertyValue.Customer>
              </PropertyList.Item>
              <PropertyList.Item label="ID">
                <PropertyValue.Id>{charge?.id}</PropertyValue.Id>
              </PropertyList.Item>
            </PropertyList>
          </Section>
        </Query>
      </Query>
    </>
  );
}
