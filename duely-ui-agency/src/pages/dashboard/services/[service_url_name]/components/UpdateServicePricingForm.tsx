import { service_Q, create_price_M, update_service_M, useMutation, useQuery } from '@duely/client';
import { Currency } from '@duely/core';
import {
  Form,
  FormButton,
  FormField,
  FormInfoMessage,
  useFormMessages,
  Util
} from '@duely/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

type ServiceProps = {
  service_id: string;
};

type UpdateServicePricingFormFields = {
  payment_type: string;
  unit_amount_major: string;
  frequency?: string;
};

export function UpdateServicePricingForm({ service_id }: ServiceProps) {
  const form = useForm<UpdateServicePricingFormFields>();
  const { data: service, loading: serviceLoading } = useQuery(service_Q, { service_id });

  const {
    infoMessage,
    setInfoMessage,
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage
  } = useFormMessages();

  const [createPrice, statePrice] = useMutation(create_price_M);
  const [updateService, stateUpdate] = useMutation(update_service_M);

  const state = {
    loading: serviceLoading || stateUpdate.loading || statePrice.loading
  };

  const reset = form.reset;

  useEffect(() => {
    const default_variant = service?.default_variant;
    const default_price = default_variant?.default_price;
    if (!default_price) return;

    reset({
      unit_amount_major: Currency.minorCurrencyAmountToNumber(
        default_price.unit_amount,
        default_price.currency as Currency
      ).toString(),
      payment_type: default_price.type,
      frequency:
        default_price.type === 'one_time'
          ? undefined
          : `${default_price.recurring_interval_count}:${default_price.recurring_interval}`
    });
  }, [reset, service]);

  async function onSubmit({
    unit_amount_major,
    payment_type,
    frequency
  }: UpdateServicePricingFormFields) {
    const default_variant = service?.default_variant;
    const default_price = default_variant?.default_price;
    if (!default_price) return;

    const currency = default_price.currency;
    const unit_amount = Currency.numberToMinorCurrencyAmount(
      +unit_amount_major,
      currency as Currency
    );

    const recurring: {
      recurring_interval_count?: number;
      recurring_interval?: string;
    } = {};

    if (payment_type === 'recurring') {
      const [interval_count, interval] = frequency!.split(':');
      recurring.recurring_interval_count = +interval_count;
      recurring.recurring_interval = interval;
    }

    const update = Util.diff(
      Util.pick(
        {
          unit_amount,
          currency,
          status: 'live',
          ...recurring
        },
        default_price
      ),
      default_price
    );

    if (Object.keys(update).length === 0) {
      setInfoMessage('No changes to be saved');
      form.reset();
      return;
    }

    const res_price = await createPrice({
      service_variant_id: default_variant!.id,
      unit_amount,
      currency,
      status: 'live',
      ...recurring
    });

    if (!res_price?.success) {
      setErrorMessage(res_price?.message ?? 'Unable to save changes. Something went wrong.');
      return;
    }

    const { price } = res_price;
    await updateService({ service_id: service!.id, default_price_id: price!.id, status: 'live' });

    const res = await updateService({ service_id, ...update });

    if (res?.success) {
      setSuccessMessage('Saved');
      return;
    } else {
      setErrorMessage(res?.message ?? 'Unable to save changes. Something went wrong.');
    }
  }

  const payment_type = form.watch('payment_type');

  return (
    <>
      <Form form={form} onSubmit={onSubmit} className="flex flex-col space-y-3">
        <FormField
          form={form}
          className="max-w-2xl"
          name="payment_type"
          type="radio-blocks"
          disabled
          options={[
            {
              value: 'one_time',
              element: 'Single payment',
              description: 'Clients pay a one-time fee'
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
                  form={form}
                  label="Price of service"
                  name="unit_amount_major"
                  type="text"
                  inputMode="numeric"
                  prefix="$"
                  registerOptions={{ required: true }}
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
                  form={form}
                  label="Amount"
                  name="unit_amount_major"
                  type="text"
                  inputMode="numeric"
                  prefix="$"
                  registerOptions={{ required: true }}
                />
              </div>
              <div className="max-w-xs p-2 sm:w-1/2 lg:w-1/3">
                <FormField
                  form={form}
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

        <div className="flex flex-row items-center pt-3 space-x-4">
          <FormButton form={form} spinner dense loading={state.loading}>
            Save
          </FormButton>
          <FormButton form={form} type="reset" dense disabled={state.loading}>
            Cancel
          </FormButton>
          <FormInfoMessage error={errorMessage} info={infoMessage} success={successMessage} />
        </div>
      </Form>
    </>
  );
}
