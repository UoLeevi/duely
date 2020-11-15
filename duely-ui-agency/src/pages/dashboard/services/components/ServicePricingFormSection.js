import { FormField } from '@duely/react';


export function ServicePricingFormSection({ form }) {
  const payment_type = form.watch('payment_type');
  return (
    <>
      <FormField form={form} className="max-w-2xl" name="payment_type" type="radio-blocks" options={[
        { value: 'one_time', element: 'Single payment', description: 'Clients pay a one-time fee' },
        { value: 'payment_plan', element: 'Payment plan', description: 'Payment in monthly installments' },
        { value: 'subscription', element: 'Subscription', description: 'Charge on a recurring basis' }
      ]} />

      {payment_type === 'one_time' && (
        <>
          <div className="flex flex-col sm:flex-row -m-2">
            <div className="sm:w-1/2 lg:w-1/3 p-2 max-w-xs">
              <FormField form={form} label="Price of service" name="unit_amount_hundred_cents" type="text" prefix="$" validateRule={{ required: true }} />
            </div>
          </div>
        </>
      )}

      {payment_type === 'payment_plan' && (
        <>
          <div className="flex flex-col sm:flex-row -m-2">
            <div className="sm:w-1/2 lg:w-1/3 p-2 max-w-xs">
              <FormField form={form} label="Amount per month" name="unit_amount_hundred_cents" type="text" prefix="$" validateRule={{ required: true }} />
            </div>
            <div className="sm:w-1/2 lg:w-1/3 p-2 max-w-xs">
              <FormField form={form} label="Number of monthly payments" name="recurring_interval_count" type="number" validateRule={{ required: true }} />
            </div>
          </div>
        </>
      )}

      {payment_type === 'subscription' && (
        <>
          <div className="flex flex-col sm:flex-row -m-2">
            <div className="sm:w-1/2 lg:w-1/3 p-2 max-w-xs">
              <FormField form={form} label="Amount" name="unit_amount_hundred_cents" type="text" prefix="$" validateRule={{ required: true }} />
            </div>
            <div className="sm:w-1/2 lg:w-1/3 p-2 max-w-xs">
              <FormField form={form} label="Frequency" name="recurring_interval" type="select" options={[
                { value: 'week', element: 'Every week' },
                { value: 'month', element: 'Every month' },
                { value: 'year', element: 'Every year' }
              ]} validateRule={{ required: true }} />
            </div>
          </div>
        </>
      )}
    </>
  );
}
