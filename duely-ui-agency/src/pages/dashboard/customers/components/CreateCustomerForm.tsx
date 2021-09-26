import { useForm, Form, LinkButton } from '@duely/react';
import {
  useMutation,
  useQuery,
  create_customer_M,
  current_agency_Q,
  agency_stripe_account_Q
} from '@duely/client';
import { Link } from 'react-router-dom';

type CreateCustomerFormFields = {
  email_address: string;
  name: string;
};

export function CreateCustomerForm() {
  const form = useForm<CreateCustomerFormFields>();
  const [createCustomer, stateCustomer] = useMutation(create_customer_M);
  const { data: agency, loading: agencyLoading } = useQuery(current_agency_Q);
  const { data: stripe_account, loading: stripe_accountLoading } = useQuery(
    agency_stripe_account_Q,
    { agency_id: agency!.id },
    { skip: !agency }
  );

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
          <span className="whitespace-nowrap">Customer</span>{' '}
          <span className="whitespace-nowrap">{customer!.name}</span>{' '}
          <span className="whitespace-nowrap">created succesfully</span>
        </h3>
        <LinkButton color="indigo" to="/dashboard/customers">
          Go to customers
        </LinkButton>
      </div>
    );
  }

  return (
    <>
      <h2 className="mb-3 text-xl font-medium">Create a customer</h2>
      <Form form={form} onSubmit={onSubmit} className="flex flex-col space-y-3">
        <Form.Field
          label="Customer name"
          className="max-w-xl"
          name="name"
          type="text"
          registerOptions={{ required: true }}
        />
        <Form.Field
          label="Email address"
          className="max-w-xl"
          name="email_address"
          type="email"
          registerOptions={{ required: true }}
        />
        <div className="flex flex-row items-center pt-3 space-x-8">
          <Form.Button>Create customer</Form.Button>
          <Form.InfoMessage error={state.error} />
        </div>
      </Form>
    </>
  );
}
