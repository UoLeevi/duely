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
  create_customer_M
} from '@duely/client';
import { useEffect, useMemo } from 'react';
import {
  Currency,
  formatCurrency,
  minorCurrencyAmountToNumber,
  numberToMinorCurrencyAmount
} from '@duely/util';

type CreateCouponFormFields = {
  name: string;
  coupon_type: 'amount_off' | 'percentage_off';
  amount_or_percentage_off: string;
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
  const [createCustomer, stateCustomer] = useMutation(create_customer_M);
  const [createCoupon, stateCoupon] = useMutation(create_coupon_M);
  const { data: agency, loading: agencyLoading } = useQuery(current_agency_Q);
  const { data: stripe_account, loading: stripe_accountLoading } = useQuery(
    agency_stripe_account_Q,
    { agency_id: agency!.id },
    { skip: !agency }
  );

  const currency = agency?.default_pricing_currency ?? stripe_account?.default_currency;

  const currencyPrefix: React.ReactChild = <span className="pr-1">{currency?.toUpperCase()}</span>;
  const percengatePrefix: React.ReactChild = <span className="pr-1">%</span>;

  const state = {
    loading: stateCoupon.loading || agencyLoading || stripe_accountLoading,
    error: stateCoupon.error,
    success: stateCoupon.data?.success
  };

  const name_field = form.useFormFieldState('name');
  const coupon_type = form.useFormFieldValue('coupon_type');
  const amount_or_percentage_off = form.useFormFieldValue('amount_or_percentage_off');
  const name = form.useFormFieldValue('name');

  useEffect(() => {
    if (!name_field.isDirty) {
      if (coupon_type == 'amount_off') {
        const amount = +amount_or_percentage_off!;
        form.setValue('name', `${formatCurrency(amount, currency as Currency)} off`);
      } else {
        const percentage = +amount_or_percentage_off! / 100;
        form.setValue('name', `${percentage} % off`);
      }
    }
  }, [name_field.isDirty, name]);

  async function onSubmit({
    coupon_type,
    amount_or_percentage_off,
    ...value
  }: CreateCouponFormFields) {
    console.log(value);

    let args;

    if (coupon_type === 'amount_off') {
      args = {
        amount_off: minorCurrencyAmountToNumber(+amount_or_percentage_off, currency as Currency)
      };
    } else {
      args = {
        percentage_off: +amount_or_percentage_off
      };
    }

    const res_coupon = await createCoupon({
      stripe_account_id: stripe_account!.id,
      currency,
      name,
      ...args
    });

    if (!res_coupon?.success) {
      setErrorMessage('Error while creating coupon:' + res_coupon?.message);
      return;
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
        <LinkButton color="indigo" to="/dashboard/payments/coupons">
          Go to coupons
        </LinkButton>
      </div>
    );
  }

  return (
    <>
      <h2 className="mb-4 text-xl font-medium">Create a coupon</h2>
      <Form form={form} onSubmit={onSubmit} className="flex flex-col space-y-3">
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
              value: 'percentage_off',
              element: 'Percentage off',
              description: 'Percentage discount'
            }
          ]}
          registerOptions={{ required: true, defaultValue: 'amount_off' }}
        />

        <Form.Field
          label={coupon_type === 'amount_off' ? 'Amount off' : 'Percentage off'}
          name="amount_or_percentage_off"
          type="text"
          inputMode="numeric"
          prefix={coupon_type === 'amount_off' ? currencyPrefix : percengatePrefix}
          registerOptions={{
            required: true,
            rules: [ValidationRules.isPositiveNumber],
            inputFilter: InputFilters.numeric
          }}
          loading={stripe_accountLoading}
        />

        <Form.Field
          label="Coupon name"
          className="max-w-xl"
          name="name"
          type="text"
          registerOptions={{ required: true }}
        />
        <div className="flex flex-row items-center pt-3 space-x-8">
          <Form.Button>Create coupon</Form.Button>
          <Form.InfoMessage error={errorMessage} info={infoMessage} success={successMessage} />
        </div>
      </Form>
    </>
  );
}
