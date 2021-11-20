import {
  useForm,
  Form,
  ValidationRules,
  InputFilters,
  LinkButton,
  useFormMessages
} from '@duely/react';
import {
  useQuery,
  useMutation,
  current_agency_Q,
  agency_stripe_account_Q,
  customers_Q,
  create_coupon_M,
  create_customer_M,
  products_Q,
  create_promotion_code_M
} from '@duely/client';
import { useEffect, useMemo } from 'react';
import {
  Currency,
  dateToTimestamp,
  formatCurrency,
  numberToMinorCurrencyAmount
} from '@duely/util';

type CreateCouponFormFields = {
  name: string;
  coupon_type: 'amount_off' | 'percent_off';
  amount_or_percent_off: string;
  applies_to_products: string[];
  has_expiry: boolean;
  redeem_by_date: Date;
  has_promotion_code: boolean;
  promotion_code: string;
};

export function CreateCouponForm() {
  const form = useForm<CreateCouponFormFields>();
  const {
    infoMessage,
    setInfoMessage,
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage
  } = useFormMessages();
  const [createCoupon, stateCoupon] = useMutation(create_coupon_M);
  const [createPromotionCode, statePromotionCode] = useMutation(create_promotion_code_M);
  const { data: agency, loading: agencyLoading } = useQuery(current_agency_Q);
  const { data: stripe_account, loading: stripe_accountLoading } = useQuery(
    agency_stripe_account_Q,
    { agency_id: agency!.id },
    { skip: !agency }
  );

  const { data: products, loading: productsLoading } = useQuery(
    products_Q,
    {
      filter: {
        agency_id: agency?.id!,
        active: true
      }
    },
    { skip: !agency }
  );

  const currency =
    (agency?.default_pricing_currency as Currency) ??
    (stripe_account?.default_currency as Currency);

  const currencyPrefix: React.ReactChild = <span className="pr-1">{currency?.toUpperCase()}</span>;
  const percentPrefix: React.ReactChild = <span className="pr-1">%</span>;

  const name_field = form.useFormFieldState('name');
  const coupon_type = form.useFormFieldValue('coupon_type');
  const has_expiry = form.useFormFieldValue('has_expiry');
  const has_promotion_code = form.useFormFieldValue('has_promotion_code');
  const amount_or_percent_off = form.useFormFieldValue('amount_or_percent_off');
  const applies_to_products = form.useFieldArrayValue('applies_to_products');

  const productName =
    applies_to_products?.length === 1
      ? products?.find((p) => p.id === applies_to_products[0])?.name ?? ''
      : '';

  const state = {
    loading:
      stateCoupon.loading || agencyLoading || stripe_accountLoading || statePromotionCode.loading,
    error: stateCoupon.error || statePromotionCode.error,
    success: has_promotion_code
      ? stateCoupon.data?.success && statePromotionCode.data?.success
      : stateCoupon.data?.success
  };

  useEffect(() => {
    const number = +(amount_or_percent_off ?? 0);
    if (!name_field?.isDirty) {
      if (coupon_type == 'amount_off') {
        const minorAmount = numberToMinorCurrencyAmount(number, currency);
        form.setValue('name', `${productName} ${formatCurrency(minorAmount, currency)} off`.trim());
      } else {
        form.setValue('name', `${productName} ${number} % off`.trim());
      }
    }
  }, [name_field?.isDirty, coupon_type, amount_or_percent_off, productName]);

  async function onSubmit({
    coupon_type,
    name,
    amount_or_percent_off,
    applies_to_products,
    redeem_by_date,
    has_expiry,
    has_promotion_code,
    promotion_code,
    ...rest
  }: CreateCouponFormFields) {
    let args: Parameters<typeof createCoupon>[0] = {
      stripe_account_id: stripe_account!.id,
      name,
      currency,
      applies_to: {
        products: applies_to_products
      }
    };

    if (coupon_type === 'amount_off') {
      args.amount_off = numberToMinorCurrencyAmount(+amount_or_percent_off, currency);
    } else {
      args.percent_off = +amount_or_percent_off;
    }

    if (has_expiry && redeem_by_date) {
      args.redeem_by = dateToTimestamp(redeem_by_date);
    }

    const res_coupon = await createCoupon(args);

    if (!res_coupon?.success) {
      setErrorMessage('Error while creating coupon:' + res_coupon?.message);
      return;
    }

    if (has_promotion_code) {
      const args: Parameters<typeof createPromotionCode>[0] = {
        stripe_account_id: stripe_account!.id,
        coupon: res_coupon.coupon!.id,
        code: promotion_code
      };

      if (has_expiry && redeem_by_date) {
        args.expires_at = dateToTimestamp(redeem_by_date);
      }

      const res_promotion_code = await createPromotionCode(args);

      if (!res_promotion_code?.success) {
        setErrorMessage(
          'Coupon created but error while creating promotion code:' + res_promotion_code?.message
        );
        return;
      }
    }

    setSuccessMessage(`Coupon created successfully`);
  }

  if (state.success) {
    const { coupon } = stateCoupon.data!;
    return (
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="grid w-12 h-12 bg-green-200 rounded-full place-items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="text-3xl text-green-600 h-[1em] w-[1em]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold">
          <span className="whitespace-nowrap">Coupon</span>{' '}
          <span className="whitespace-nowrap">{coupon!.name}</span>{' '}
          <span className="whitespace-nowrap">created succesfully</span>
        </h3>
        <LinkButton color="indigo" to="/dashboard/products/coupons">
          Go to coupons
        </LinkButton>
      </div>
    );
  }

  return (
    <>
      <h2 className="mb-4 text-xl font-medium">Create a coupon</h2>
      <Form form={form} onSubmit={onSubmit} className="flex flex-col space-y-3">
        <Form.Label className="text-sm">Coupon Type</Form.Label>
        <Form.Field
          className="max-w-2xl"
          name="coupon_type"
          type="radio-blocks"
          options={[
            {
              value: 'amount_off',
              element: 'Amount off',
              description: 'Fixed amount discount'
            },
            {
              value: 'percent_off',
              element: 'Percent off',
              description: 'Percent discount'
            }
          ]}
          registerOptions={{ required: true, defaultValue: 'amount_off' }}
        />

        <Form.Field
          label={coupon_type === 'amount_off' ? 'Amount off' : 'Percent off'}
          name="amount_or_percent_off"
          type="text"
          className="w-48"
          inputMode="numeric"
          prefix={coupon_type === 'amount_off' ? currencyPrefix : percentPrefix}
          registerOptions={{
            required: true,
            rules: [ValidationRules.isPositiveNumber],
            inputFilter: InputFilters.numeric
          }}
          loading={stripe_accountLoading}
        />

        <Form.Field
          label="Product"
          className="max-w-lg"
          name="applies_to_products"
          type="select"
          multiple
          options={(products ?? []).map((p) => ({ element: p.name, value: p.id }))}
          hint="Product that the coupon applies to."
          registerOptions={{ required: true }}
          loading={productsLoading}
        />

        <Form.Field
          label="Coupon name"
          className="max-w-lg"
          name="name"
          type="text"
          registerOptions={{ required: true }}
        />

        <div className="flex flex-col -m-2 sm:flex-row">
          <div className="max-w-xs p-2 sm:w-1/2 lg:w-1/3">
            <Form.Field
              label="Promotion code"
              className="w-48"
              name="has_promotion_code"
              type="checkbox"
              hint="Does coupon have a promotion code."
            />
          </div>
          <div className="max-w-xs p-2 sm:w-1/2 lg:w-1/3">
            {has_promotion_code && (
              <Form.Field
                label="Promotion code"
                className="w-48"
                name="promotion_code"
                hint="Promotion code text to use at checkout."
                registerOptions={{
                  required: true
                }}
              />
            )}
          </div>
        </div>

        <div className="flex flex-col -m-2 sm:flex-row">
          <div className="max-w-xs p-2 sm:w-1/2 lg:w-1/3">
            <Form.Field
              label="Expires"
              className="w-48"
              name="has_expiry"
              type="checkbox"
              hint="Does coupon have an expiry date."
            />
          </div>
          <div className="max-w-xs p-2 sm:w-1/2 lg:w-1/3">
            {has_expiry && (
              <Form.Field
                label="Expiry date"
                className="w-64"
                name="redeem_by_date"
                type="datetime-local"
                hint="Last time at which the coupon can be redeemed."
                registerOptions={{
                  required: true
                }}
              />
            )}
          </div>
        </div>

        <div className="flex flex-row items-center pt-3 space-x-8">
          <Form.Button>Create coupon</Form.Button>
          <Form.InfoMessage error={errorMessage} info={infoMessage} success={successMessage} />
        </div>
      </Form>
    </>
  );
}
