import {
  useForm,
  Form,
  ValidationRules,
  Button,
  Table,
  InputFilters,
  FieldArrayItem,
  LinkButton,
  useFormMessages
} from '@duely/react';
import {
  useQuery,
  useMutation,
  current_agency_Q,
  agency_stripe_account_Q,
  customers_Q,
  create_invoice_M,
  create_customer_M
} from '@duely/client';
import { useEffect, useMemo } from 'react';

type CreateInvoiceFormFields = {
  customer_email_address: string;
  customer_name: string;
  message?: string;
  items: {
    description: string;
    unit_amount: number;
    quantity: number;
  }[];
};

export function CreateInvoiceForm() {
  const form = useForm<CreateInvoiceFormFields>();
  const {
    infoMessage,
    setInfoMessage,
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage
  } = useFormMessages();
  const [createCustomer, stateCustomer] = useMutation(create_customer_M);
  const [createInvoice, stateInvoice] = useMutation(create_invoice_M);
  const { data: agency, loading: agencyLoading } = useQuery(current_agency_Q);
  const { data: stripe_account, loading: stripe_accountLoading } = useQuery(
    agency_stripe_account_Q,
    { agency_id: agency!.id },
    { skip: !agency }
  );

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
    loading: stateInvoice.loading || agencyLoading || stripe_accountLoading,
    error: stateInvoice.error,
    success: stateInvoice.data?.success
  };

  async function onSubmit({
    customer_email_address,
    customer_name,
    ...value
  }: CreateInvoiceFormFields) {
    if (!value.items?.length) {
      setErrorMessage('Items are required.');
      return;
    }

    // if (!customer) {
    //   const res = await createCustomer({
    //     stripe_account_id: stripe_account!.id,
    //     email_address: customer_email_address,
    //     name: customer_name
    //   });

    //   if (!res?.success) {
    //     setErrorMessage('Error while creating customer:' + res?.message);
    //     return;
    //   }

    //   customer = res.customer!;
    // }

    console.log(value);

    // const res_invoice = await createInvoice({
    //   stripe_account_id: stripe_account!.id,
    //   name,
    //   email_address
    // });
    // if (!res_invoice?.success) return;
  }

  if (state.success) {
    const { invoice } = stateInvoice.data!;
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
          <span className="whitespace-nowrap">Invoice</span>{' '}
          <span className="whitespace-nowrap">{invoice!.number}</span>{' '}
          <span className="whitespace-nowrap">created succesfully</span>
        </h3>
        <LinkButton color="indigo" to="/dashboard/payments/invoices">
          Go to invoices
        </LinkButton>
      </div>
    );
  }

  const { fields, addItem, removeItem } = form.useFieldArray('items');

  return (
    <>
      <h2 className="mb-4 text-xl font-medium">Create an invoice</h2>
      <Form form={form} onSubmit={onSubmit} className="flex flex-col space-y-3">
        <div className="pb-2">
          <Form.Label className="inline-block pb-1">Customer</Form.Label>
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
        </div>

        <Form.Field
          label="Days until due"
          className="w-24"
          name="days_until_due"
          suffix="days"
          defaultValue="30"
          registerOptions={{
            required: true,
            rules: [ValidationRules.isPositiveInteger],
            inputFilter: InputFilters.integer
          }}
        />

        <div className="pb-2">
          <Form.Label>Items</Form.Label>
          <div className="flex flex-col pb-3 border-b">
            <Table items={fields} keyField="key">
              <Table.Column header="Description" span={6}>
                {(field: FieldArrayItem | null, i) => {
                  if (!field) return null;
                  return (
                    <Form.Field
                      type="text"
                      name={field.getName('description')}
                      placeholder={`Item ${i + 1}`}
                      registerOptions={{ required: true }}
                    />
                  );
                }}
              </Table.Column>

              <Table.Column header="Unit amount" span={3}>
                {(field: FieldArrayItem | null, i) => {
                  if (!field) return null;
                  return (
                    <Form.Field
                      name={field.getName('unit_amount')}
                      type="text"
                      inputMode="numeric"
                      prefix={currencyPrefix}
                      registerOptions={{
                        required: true,
                        rules: [ValidationRules.isPositiveNumber],
                        inputFilter: InputFilters.numeric
                      }}
                    />
                  );
                }}
              </Table.Column>

              <Table.Column header="Quantity" span={3}>
                {(field: FieldArrayItem | null, i) => {
                  if (!field) return null;
                  return (
                    <Form.Field
                      name={field.getName('quantity')}
                      type="text"
                      inputMode="numeric"
                      prefix={<span className="pr-1">x</span>}
                      defaultValue={1}
                      registerOptions={{
                        required: true,
                        rules: [ValidationRules.isPositiveNumber],
                        inputFilter: InputFilters.numeric
                      }}
                    />
                  );
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

            <div className="flex">
              <Button type="button" className="text-sm" dense icon="plus.solid" onClick={addItem}>
                Add item
              </Button>
            </div>
          </div>
        </div>

        <Form.Field label="Message to customer" name="message" type="textarea" rows={6} />

        <div className="flex flex-row items-center pt-3 space-x-8">
          <Form.Button>Create invoice</Form.Button>
          <Form.InfoMessage error={errorMessage} info={infoMessage} success={successMessage} />
        </div>
      </Form>
    </>
  );
}
