import { product_Q, create_price_M, update_product_M, useMutation, useQuery } from '@duely/client';
import { Currency } from '@duely/core';
import {
  Form,
  FormButton,
  FormField,
  FormInfoMessage,
  useFormMessages,
  Util,
  useForm,
  InputFilters,
  ValidationRules
} from '@duely/react';

import { Util as CoreUtil } from '@duely/core';

type ProductProps = {
  product_id?: string;
};

type UpdateProductPricingFormFields = {
  payment_type: string;
  unit_amount_major: string;
  frequency?: string;
};

export function UpdateProductPricingForm({ product_id }: ProductProps) {
  const form = useForm<UpdateProductPricingFormFields>();
  const { data: product, loading: productLoading } = useQuery(
    product_Q,
    { product_id: product_id! },
    { skip: !product_id }
  );

  const currencyPrefix: React.ReactNode = (
    <span className="pr-1">{product?.default_price?.currency?.toUpperCase()}</span>
  );

  const {
    infoMessage,
    setInfoMessage,
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage
  } = useFormMessages();

  const [createPrice, statePrice] = useMutation(create_price_M);
  const [updateProduct, stateUpdate] = useMutation(update_product_M);

  const state = {
    loading: !product_id || productLoading
  };

  const updateLoading = stateUpdate.loading || statePrice.loading;

  const default_price = product?.default_price;
  const unit_amount_major =
    (default_price &&
      Currency.minorCurrencyAmountToNumber(
        default_price.unit_amount,
        default_price.currency as Currency
      ).toString()) ??
    undefined;

  const frequency = !default_price
    ? undefined
    : default_price.type === 'one_time'
    ? undefined
    : `${default_price.recurring_interval_count}:${default_price.recurring_interval}`;

  async function onSubmit({
    unit_amount_major,
    payment_type,
    frequency
  }: UpdateProductPricingFormFields) {
    const default_price = product?.default_price;
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
      CoreUtil.pick(
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
      product_id: product!.id,
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
    const res = await updateProduct({ product_id: product!.id, default_price_id: price!.id });

    if (res?.success) {
      setSuccessMessage('Saved');
      return;
    } else {
      setErrorMessage(res?.message ?? 'Unable to save changes. Something went wrong.');
    }
  }

  const payment_type = form.useFormFieldValue('payment_type') ?? default_price?.type;

  return (
    <>
      <Form form={form} onSubmit={onSubmit} className="flex flex-col space-y-3">
        <FormField
          className="max-w-2xl"
          name="payment_type"
          defaultValue={default_price?.type}
          type="radio-blocks"
          disabled
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
          loading={state.loading}
        />

        {payment_type === 'one_time' && (
          <>
            <div className="flex flex-col -m-2 sm:flex-row">
              <div className="max-w-xs p-2 sm:w-1/2 lg:w-1/3">
                <FormField
                  defaultValue={unit_amount_major}
                  label="Price of product"
                  name="unit_amount_major"
                  type="text"
                  inputMode="numeric"
                  prefix={currencyPrefix}
                  registerOptions={{
                    required: true,
                    inputFilter: InputFilters.numeric,
                    rules: [ValidationRules.isNumber, ValidationRules.isPositiveNumber]
                  }}
                  loading={state.loading}
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
                  defaultValue={unit_amount_major}
                  label="Amount"
                  name="unit_amount_major"
                  type="text"
                  inputMode="numeric"
                  prefix={currencyPrefix}
                  registerOptions={{
                    required: true,
                    inputFilter: InputFilters.numeric,
                    rules: [ValidationRules.isNumber, ValidationRules.isPositiveNumber]
                  }}
                  loading={state.loading}
                />
              </div>
              <div className="max-w-xs p-2 sm:w-1/2 lg:w-1/3">
                <FormField
                  defaultValue={frequency}
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
                  loading={state.loading}
                />
              </div>
            </div>
          </>
        )}

        <div className="flex flex-row items-center pt-3 space-x-4">
          <FormButton dense disabled={updateLoading}>
            Save
          </FormButton>
          <FormButton type="reset" dense disabled={updateLoading}>
            Cancel
          </FormButton>
          <FormInfoMessage error={errorMessage} info={infoMessage} success={successMessage} />
        </div>
      </Form>
    </>
  );
}
