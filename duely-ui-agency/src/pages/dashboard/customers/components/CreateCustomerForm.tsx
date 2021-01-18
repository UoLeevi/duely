import { useForm } from 'react-hook-form';
import { FormButton, FormErrorInfo, FormField } from '@duely/react';
import { useMutation, useQuery, create_customer_M, current_agency_Q, agency_stripe_account_Q } from '@duely/client';
import { BsCheck } from 'react-icons/bs';
import { Link } from 'react-router-dom';

type CreateCustomerFormFields = {
  email_address: string;
  name: string;
};

export function CreateCustomerForm() {
  const form = useForm<CreateCustomerFormFields>();
  const [createCustomer, stateCustomer] = useMutation(create_customer_M);
  const { data: agency, loading: agencyLoading } = useQuery(current_agency_Q);
  const { data: stripe_account, loading: stripe_accountLoading } = useQuery(agency_stripe_account_Q, { agency_id: agency!.id }, { skip: !agency });

  const state = {
    loading: stateCustomer.loading || agencyLoading || stripe_accountLoading,
    error: stateCustomer.error,
    success: stateCustomer.data?.success
  };

  async function onSubmit({ name, email_address }: CreateCustomerFormFields) {
    const res_customer = await createCustomer({
      stripe_account_id: stripe_account!.id,
      name,
      email_address
    });

    if (!res_customer?.success) return;
  }

  if (state.success) {
    const { customer } = stateCustomer.data!;
    return (
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="grid w-12 h-12 bg-green-200 rounded-full place-items-center">
          <BsCheck className="text-3xl text-green-600" />
        </div>
        <h3 className="text-2xl font-semibold">
          <span className="whitespace-nowrap">Customer</span>{' '}
          <span className="whitespace-nowrap">{customer!.name}</span>{' '}
          <span className="whitespace-nowrap">created succesfully</span>
        </h3>
        <Link
          className="px-12 py-3 mt-2 font-medium text-white bg-indigo-500 rounded-md"
          to="/dashboard/customers"
        >
          Go to customers
        </Link>
      </div>
    );
  }

  return (
    <>
      <h2 className="mb-3 text-xl font-medium">Create a customer</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-3">
        <FormField
          form={form}
          label="Customer name"
          className="max-w-xl"
          name="name"
          type="text"
          registerOptions={{ required: true }}
        />
        <FormField
          form={form}
          label="Email address"
          className="max-w-xl"
          name="email_address"
          type="email"
          registerOptions={{ required: true }}
        />
        <div className="flex flex-row items-center pt-3 space-x-8">
          <FormButton form={form} spinner loading={state.loading}>
            Create customer
          </FormButton>
          <FormErrorInfo error={state.error} />
        </div>
      </form>
    </>
  );
}
