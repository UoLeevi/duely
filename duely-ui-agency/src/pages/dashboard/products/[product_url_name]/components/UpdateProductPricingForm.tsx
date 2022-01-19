import {
  product_Q,
  create_price_M,
  update_product_M,
  useMutation,
  useQuery,
  current_agency_Q,
  agency_stripe_account_Q
} from '@duely/client';
import {
  Currency,
  diff,
  numberToMinorCurrencyAmount,
  pick,
  minorCurrencyAmountToNumber
} from '@duely/util';
import { Form, useFormMessages, useForm, InputFilters, ValidationRules } from '@duely/react';

type ProductProps = {
  product_id?: string;
};

type UpdateProductPricingFormFields = {
  payment_type: string;
  unit_amount_major: string;
  frequency?: string;
  is_default_price: boolean;
};

export function UpdateProductPricingForm({ product_id }: ProductProps) {
  const form = useForm<UpdateProductPricingFormFields>();
  const { data: product, loading: productLoading } = useQuery(
    product_Q,
    { product_id: product_id! },
    { skip: !product_id }
  );

  const { data: agency } = useQuery(current_agency_Q);
  const { data: stripe_account, loading: stripe_accountLoading } = useQuery(
    agency_stripe_account_Q,
    { agency_id: agency!.id },
    { skip: !agency }
  );

  const {
    infoMessage,
    setInfoMessage,
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage
  } = useFormMessages();

  const [createPrice] = useMutation(create_price_M);
  const [updateProduct] = useMutation(update_product_M);

  const state = {
    loading: !product_id || stripe_accountLoading || productLoading
  };

  const currency =
    product?.default_price?.currency ??
    agency?.default_pricing_currency ??
    stripe_account?.default_currency ??
    'usd';

  const currencyPrefix: React.ReactNode = <span className="pr-1">{currency?.toUpperCase()}</span>;

  const price = product?.default_price;
  const unit_amount_major =
    (price &&
      minorCurrencyAmountToNumber(price.unit_amount, price.currency as Currency).toString()) ??
    undefined;

  const frequency = !price
    ? undefined
    : price.type === 'one_time'
    ? undefined
    : `${price.recurring_interval_count}:${price.recurring_interval}`;

  async function onSubmit({
    unit_amount_major,
    payment_type,
    frequency,
    is_default_price
  }: UpdateProductPricingFormFields) {
    const unit_amount = numberToMinorCurrencyAmount(+unit_amount_major, currency as Currency);

    const recurring: {
      recurring_interval_count?: number;
      recurring_interval?: string;
    } = {};

    if (payment_type === 'recurring') {
      const [interval_count, interval] = frequency!.split(':');
      recurring.recurring_interval_count = +interval_count;
      recurring.recurring_interval = interval;
    }

    if (product?.default_price) {
      const update = diff(
        pick(
          {
            unit_amount,
            currency,
            status: 'live',
            ...recurring
          },
          product.default_price
        ),
        product.default_price
      );

      if (Object.keys(update).length === 0) {
        setInfoMessage('No changes to be saved');
        form.reset();
        return;
      }
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

    if (!is_default_price) {
      setSuccessMessage('Saved');
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

  const payment_type = form.useFormFieldValue('payment_type') ?? price?.type;

  return (
    <>
      <Form form={form} onSubmit={onSubmit} className="flex flex-col space-y-3">
        {/* <Form.Field
          type="select"
          name="price"
          label="Price"
          className="max-w-xs"
          loading={productLoading}
          defaultValue={product?.default_price?.id}
          options={product?.prices?.map((price) => ({
            value: price.id,
            element: price.name + (product?.default_price?.id === price.id ? ' (default)' : '')
          }))}
        /> */}

        <Form.Field
          className="max-w-2xl"
          name="payment_type"
          defaultValue={price?.type ?? 'one_time'}
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
          registerOptions={{ required: true }}
          loading={state.loading}
        />

        <div className="flex flex-col -m-2 sm:flex-row">
          <div className="max-w-xs p-2 sm:w-1/2 lg:w-1/3">
            <Form.Field
              label={payment_type === 'one_time' ? 'Price of product' : 'Amount'}
              name="unit_amount_major"
              defaultValue={unit_amount_major}
              type="text"
              inputMode="numeric"
              prefix={currencyPrefix}
              registerOptions={{
                required: true,
                rules: [ValidationRules.isPositiveNumber],
                inputFilter: InputFilters.numeric
              }}
              loading={state.loading}
            />
          </div>
          {payment_type === 'recurring' && (
            <div className="max-w-xs p-2 sm:w-1/2 lg:w-1/3">
              <Form.Field
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
              />
            </div>
          )}
        </div>

        <Form.Field
          name="is_default_price"
          type="checkbox"
          label="Default price for the product"
          defaultValue={product?.default_price?.id === price?.id}
        />

        <div className="flex flex-row items-center pt-3 space-x-4">
          <Form.Button dense>Save</Form.Button>
          <Form.Button type="reset" dense>
            Cancel
          </Form.Button>
          <Form.InfoMessage error={errorMessage} info={infoMessage} success={successMessage} />
        </div>
      </Form>
    </>
  );
}
