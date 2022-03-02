import {
  useForm,
  Form,
  ValidationRules,
  Button,
  Table,
  InputFilters,
  FieldArrayItem,
  LinkButton,
  useFormMessages,
  Section,
  PropertyValue,
  ValueConverters
} from '@duely/react';
import {
  useQuery,
  useMutation,
  current_agency_Q,
  agency_stripe_account_Q,
  customers_Q,
  create_customer_M,
  create_subscription_M,
  products_Q
} from '@duely/client';
import { useEffect, useMemo } from 'react';
import { Currency, numberToMinorCurrencyAmount } from '@duely/util';

type CreateSubscriptionFormFields = {
  customer_email_address: string;
  customer_name: string;
  description?: string;
  items: {
    price: string;
    quantity: number;
  }[];
};

export function CreateSubscriptionForm() {
  const form = useForm<CreateSubscriptionFormFields>();
  const {
    infoMessage,
    setInfoMessage,
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage
  } = useFormMessages();
  const [createCustomer, stateCustomer] = useMutation(create_customer_M);
  const [createSubscription, stateSubscription] = useMutation(create_subscription_M);
  const { data: agency, loading: agencyLoading } = useQuery(current_agency_Q);
  const { data: stripe_account, loading: stripe_accountLoading } = useQuery(
    agency_stripe_account_Q,
    { agency_id: agency!.id },
    { skip: !agency }
  );

  const {
    data: products,
    loading: productsLoading,
    error: productsError
  } = useQuery(products_Q, { filter: { agency_id: agency!.id } });

  const currency = agency?.default_pricing_currency ?? stripe_account?.default_currency;

  const currencyPrefix: React.ReactChild = <span className="pr-1">{currency?.toUpperCase()}</span>;

  const {
    data: customers,
    loading: customersLoading,
    error: customersError
  } = useQuery(
    customers_Q,
    {
      filter: {
        stripe_account_id: stripe_account?.id
      }
    },
    { skip: !agency || !stripe_account }
  );

  const customer_email_address = form.useFormFieldValue('customer_email_address');

  const customerSuggestions = useMemo(() => {
    if (!customers) return [];
    if (!customer_email_address) return [];

    const searchString = customer_email_address.toLowerCase();

    const customerSuggestions = customers.filter(
      (customer) =>
        customer.email_address.split('@')[0].toLowerCase().includes(searchString) ||
        customer.name?.toLowerCase().includes(searchString)
    );

    if (
      customerSuggestions.some(
        (suggestion) => suggestion.email_address.toLowerCase() === searchString
      )
    ) {
      return [];
    }

    return customerSuggestions.map((customer) => customer.email_address);
  }, [customer_email_address, customers]);

  let customer = customer_email_address
    ? customers?.find(
        (customer) => customer.email_address.toLowerCase() === customer_email_address.toLowerCase()
      )
    : undefined;

  useEffect(() => {
    form.setValue('customer_name', customer?.name ?? '');
  }, [customer?.id]);

  const state = {
    loading: stateSubscription.loading || agencyLoading || stripe_accountLoading,
    error: stateSubscription.error,
    success: stateSubscription.data?.success
  };

  async function onSubmit({
    customer_email_address,
    customer_name,
    ...value
  }: CreateSubscriptionFormFields) {
    if (!value.items?.length) {
      setErrorMessage('Items are required.');
      return;
    }

    if (!customer) {
      const res_customer = await createCustomer({
        stripe_account_id: stripe_account!.id,
        email_address: customer_email_address,
        name: customer_name
      });

      if (!res_customer?.success) {
        setErrorMessage('Error while creating customer:' + res_customer?.message);
        return;
      }

      customer = res_customer.customer!;
    }

    console.log(value);

    const items = value.items.map((item) => ({
      price: item.price,
      quantity: item.quantity
    }));

    const res_subscription = await createSubscription({
      stripe_account_id: stripe_account!.id,
      customer: customer!.default_stripe_customer.id,
      items
    });

    if (!res_subscription?.success) {
      setErrorMessage('Error while creating subscription:' + res_subscription?.message);
      return;
    }

    setSuccessMessage(`Subscription created successfully`);
  }

  if (state.success) {
    const { subscription } = stateSubscription.data!;
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
          <span className="whitespace-nowrap">Subscription</span>{' '}
          <span className="whitespace-nowrap">{subscription!.id}</span>{' '}
          <span className="whitespace-nowrap">created succesfully</span>
        </h3>
        <LinkButton color="indigo" to="/dashboard/payments/subscriptions">
          Go to subscriptions
        </LinkButton>
      </div>
    );
  }

  const { fields, addItem, removeItem } = form.useFieldArray('items');

  return (
    <>
      <h2 className="mb-4 text-xl font-medium">Create an subscription</h2>
      <Form form={form} onSubmit={onSubmit} className="flex flex-col space-y-3">
        <Section>
          <Section.Heading size="lg">Customer</Section.Heading>
          <div className="flex flex-col -m-2 sm:flex-row">
            <div className="flex-1 p-2">
              <Form.Field
                label="Email address"
                className="max-w-xl"
                name="customer_email_address"
                suggestions={customerSuggestions}
                registerOptions={{
                  required: true,
                  rules: [ValidationRules.isEmailAddress]
                }}
              />
            </div>

            <div className="flex-1 p-2">
              <Form.Field
                label="Name"
                className="max-w-xl"
                name="customer_name"
                readOnly={!!customer}
              />
            </div>
          </div>
        </Section>

        <Section>
          <Section.Heading size="lg">Pricing</Section.Heading>
          <div className="flex flex-col pb-3 border-b">
            <Table items={fields} keyField="key" dense>
              <Table.Column header="Product" span={6} justify="stretch">
                {(field: FieldArrayItem | null, i) => {
                  if (!field) return null;

                  return (
                    <Form.Field
                      dense
                      tooltip
                      type="select"
                      name={field.getName('price')}
                      options={products?.flatMap((product) =>
                        product.prices!.map((price) => ({
                          group: product.name,
                          value: price.id,
                          element: price.name
                        }))
                      )}
                      loading={productsLoading}
                      registerOptions={{ required: true }}
                    />
                  );
                }}
              </Table.Column>

              <Table.Column header="Quantity" span={3}>
                {(field: FieldArrayItem | null, i) => {
                  if (!field) return null;
                  return (
                    <Form.Field
                      dense
                      tooltip
                      name={field.getName('quantity')}
                      type="text"
                      inputMode="numeric"
                      prefix={<span className="pr-1">x</span>}
                      defaultValue={1}
                      registerOptions={{
                        required: true,
                        rules: [ValidationRules.isPositiveNumber],
                        inputFilter: InputFilters.numeric,
                        valueConverter: ValueConverters.number
                      }}
                    />
                  );
                }}
              </Table.Column>

              <Table.Column header="Total" span={3}>
                {(field: FieldArrayItem | null, i) => {
                  if (!field) return null;
                  return <PropertyValue>123</PropertyValue>;
                }}
              </Table.Column>

              <Table.Column header="" span={2}>
                {(field: FieldArrayItem | null, i) => {
                  if (!field) return null;
                  return (
                    <Button
                      type="button"
                      className="mb-auto text-sm w-max"
                      dense
                      shrink
                      icon="trash"
                      onClick={() => removeItem(i)}
                    />
                  );
                }}
              </Table.Column>
            </Table>

            <div className="flex mt-1">
              <Button type="button" className="text-sm" dense icon="plus.solid" onClick={addItem}>
                Add item
              </Button>
            </div>
          </div>
        </Section>

        <Form.Field label="Message to customer" name="description" type="textarea" rows={6} />

        <div className="flex flex-row items-center pt-3 space-x-8">
          <Form.Button>Create subscription</Form.Button>
          <Form.InfoMessage error={errorMessage} info={infoMessage} success={successMessage} />
        </div>
      </Form>
    </>
  );
}
