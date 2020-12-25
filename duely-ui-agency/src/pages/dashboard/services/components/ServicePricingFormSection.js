import { FormField } from '@duely/react';


export function ServicePricingFormSection({ form }) {
  const payment_type = form.watch('payment_type');
  return (
    <>
      <FormField form={form} className="max-w-2xl" name="payment_type" type="radio-blocks" options={[
        { value: 'one_time', element: 'Single payment', description: 'Clients pay a one-time fee' },
        { value: 'recurring', element: 'Subscription', description: 'Charge on a recurring basis' }
      ]} />

      {payment_type === 'one_time' && (
        <>
          <div className="flex flex-col -m-2 sm:flex-row">
            <div className="max-w-xs p-2 sm:w-1/2 lg:w-1/3">
              <FormField form={form} label="Price of service" name="unit_amount_hundred_cents" type="text" inputMode="numeric" prefix="$" registerOptions={{ required: true }} />
            </div>
          </div>
        </>
      )}

      {payment_type === 'recurring' && (
        <>
          <div className="flex flex-col -m-2 sm:flex-row">
            <div className="max-w-xs p-2 sm:w-1/2 lg:w-1/3">
              <FormField form={form} label="Amount" name="unit_amount_hundred_cents" type="text" inputMode="numeric" prefix="$" registerOptions={{ required: true }} />
            </div>
            <div className="max-w-xs p-2 sm:w-1/2 lg:w-1/3">
              <FormField form={form} label="Frequency" name="frequency" type="select" options={[
                { value: '1:week', element: 'Every week' },
                { value: '2:week', element: 'Every 2 weeks' },
                { value: '1:month', element: 'Every month' },
                { value: '3:month', element: 'Every 3 months' },
                { value: '6:month', element: 'Every 6 months' },
                { value: '1:year', element: 'Every year' }
              ]} registerOptions={{ required: true }} />
            </div>
          </div>
        </>
      )}
    </>
  );
}
