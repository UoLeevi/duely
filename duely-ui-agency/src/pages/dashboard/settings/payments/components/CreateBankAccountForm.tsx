import { FormButton, FormInfoMessage, FormField, useForm, Form, LinkButton } from '@duely/react';
import {
  useMutation,
  useQuery,
  create_bank_account_M,
  agency_stripe_account_Q,
  countries_Q,
  current_agency_extended_Q
} from '@duely/client';
import { useMemo } from 'react';

type CreateBankAccountFormFields = {
  country: string;
  currency: string;
  account_number: string;
  account_holder_name: string;
  routing_number: string;
};

export function CreateBankAccountForm() {
  const form = useForm<CreateBankAccountFormFields>();
  const [createBankAccount, stateBankAccount] = useMutation(create_bank_account_M);
  const { data: agency, loading: agencyLoading } = useQuery(current_agency_extended_Q);
  const { data: stripe_account, loading: stripe_accountLoading } = useQuery(
    agency_stripe_account_Q,
    { agency_id: agency?.id! },
    { skip: !agency }
  );

  // countries
  const countriesQuery = useQuery(countries_Q);
  const countries = useMemo(
    () =>
      countriesQuery.data
        ?.map((c) => ({ value: c.code, element: `${c.name} ${c.flag}` }))
        ?.sort((a, b) => a.element.localeCompare(b.element)),
    [countriesQuery.data]
  );

  const currencies = agency?.supported_payment_currencies
    ?.map((c) => ({ value: c, element: c.toUpperCase() }))
    ?.sort((a, b) => a.element.localeCompare(b.element));

  const state = {
    loading: stateBankAccount.loading || agencyLoading || stripe_accountLoading,
    error: stateBankAccount.error,
    success: stateBankAccount.data?.success
  };

  async function onSubmit(data: CreateBankAccountFormFields) {
    data = Object.fromEntries(
      Object.entries(data).filter((entry) => ![undefined, null, ''].includes(entry[1]))
    ) as CreateBankAccountFormFields;

    const res_bank_account = await createBankAccount({
      stripe_account_id: stripe_account!.id,
      ...data
    });

    if (!res_bank_account?.success) return;
  }

  if (state.success) {
    const { bank_account } = stateBankAccount.data!;
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
        <h3 className="text-xl font-semibold">
          <span className="whitespace-nowrap">BankAccount</span>{' '}
          <span className="font-mono whitespace-nowrap">********{bank_account?.last4}</span>{' '}
          <span className="whitespace-nowrap">created succesfully</span>
        </h3>
        <LinkButton color="indigo" to="/dashboard/bank_accounts">
          Go to bank_accounts
        </LinkButton>
      </div>
    );
  }

  return (
    <>
      <h2 className="mb-3 text-xl font-medium">Create a bank account</h2>
      <Form form={form} onSubmit={onSubmit} className="flex flex-col space-y-3">
        <FormField
          label="Account number"
          className="max-w-lg"
          name="account_number"
          type="text"
          registerOptions={{ required: true }}
          hint="The account number for the bank account. Must be a checking account."
        />
        <FormField
          label="Account holder name"
          className="max-w-md"
          name="account_holder_name"
          type="text"
          hint="The name of the person or business that owns the bank account."
        />
        <FormField
          label="Account holder type"
          className="max-w-md"
          name="account_holder_type"
          hint="The type of entity that holds the account."
          type="radio-blocks"
          dense
          options={[
            {
              value: 'individual',
              element: 'Individual'
            },
            {
              value: 'company',
              element: 'Business'
            }
          ]}
        />
        <FormField
          defaultValue={stripe_account?.country ?? undefined}
          label="Country"
          name="country"
          type="select"
          className="max-w-xs"
          loading={countriesQuery.loading}
          options={countries}
          registerOptions={{ required: true }}
          hint="The country the bank account is located in."
        />
        <FormField
          defaultValue={stripe_account?.default_currency ?? undefined}
          name="currency"
          label="Currency"
          type="select"
          className="max-w-xs"
          options={currencies}
          loading={stripe_accountLoading || agencyLoading}
          hint="The currency paid out to the bank account."
          registerOptions={{ required: true }}
        />
        <FormField
          label="Routing number"
          className="max-w-md"
          name="routing_number"
          type="text"
          hint={
            <>
              <span>
                The routing transit number for the bank account. Optional based on country.
              </span>
              <br />
              <span>For more infomation, see Stripe documentation on </span>
              <a
                href="https://stripe.com/docs/connect/payouts-bank-accounts#formats"
                className="text-indigo-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                bank account formats by country
              </a>
              <span>.</span>
            </>
          }
        />
        <div className="flex flex-row items-center pt-3 space-x-8">
          <FormButton>Create bank account</FormButton>
          <FormInfoMessage error={state.error} />
        </div>
      </Form>
    </>
  );
}
