import { agency_stripe_account_Q, current_agency_Q, useQuery } from '@duely/client';
import { FormField, UseFormReturn } from '@duely/react';

type ProductPricingFormSectionFields = {
  unit_amount_major: string;
  payment_type: 'one_time' | 'recurring';
  frequency?: string;
};

type ProductPricingFormSectionProps<TFieldValues extends ProductPricingFormSectionFields> = {
  form: UseFormReturn<TFieldValues>;
};

export function ProductPricingFormSection<TFieldValues extends ProductPricingFormSectionFields>({
  form
}: ProductPricingFormSectionProps<TFieldValues>) {
  const { data: agency } = useQuery(current_agency_Q);
  const { data: stripe_account, loading: stripe_accountLoading } = useQuery(
    agency_stripe_account_Q,
    { agency_id: agency!.id },
    { skip: !agency }
  );

  const currency = agency?.default_pricing_currency ?? stripe_account?.default_currency;

  const currencyPrefix: React.ReactChild = <span className="pr-1">{currency?.toUpperCase()}</span>;

  const payment_type = form.useFormFieldValue('payment_type');
  return (
    <>
      <FormField
        className="max-w-2xl"
        name="payment_type"
        type="radio-blocks"
        options={[
          {
            value: 'one_time',
            element: 'Single payment',
            description: 'Customers pay a one-time fee'
          },
          {
            value: 'recurring',
            element: 'Subscription',
            description: 'Charge on a recurring basis'
          }
        ]}
      />

      {payment_type === 'one_time' && (
        <>
          <div className="flex flex-col -m-2 sm:flex-row">
            <div className="max-w-xs p-2 sm:w-1/2 lg:w-1/3">
              <FormField
                label="Price of product"
                name="unit_amount_major"
                type="text"
                inputMode="numeric"
                prefix={currencyPrefix}
                registerOptions={{ required: true }}
                loading={stripe_accountLoading}
              />
            </div>
          </div>
        </>
      )}

      {payment_type === 'recurring' && (
        <>
          <div className="flex flex-col -m-2 sm:flex-row">
            <div className="max-w-xs p-2 sm:w-1/2 lg:w-1/3">
              <FormField
                label="Amount"
                name="unit_amount_major"
                type="text"
                inputMode="numeric"
                prefix={currencyPrefix}
                registerOptions={{ required: true }}
                loading={stripe_accountLoading}
              />
            </div>
            <div className="max-w-xs p-2 sm:w-1/2 lg:w-1/3">
              <FormField
                label="Frequency"
                name="frequency"
                type="select"
                options={[
                  { value: '1:week', element: 'Every week' },
                  { value: '2:week', element: 'Every 2 weeks' },
                  { value: '1:month', element: 'Every month' },
                  { value: '3:month', element: 'Every 3 months' },
                  { value: '6:month', element: 'Every 6 months' },
                  { value: '1:year', element: 'Every year' }
                ]}
                registerOptions={{ required: true }}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
