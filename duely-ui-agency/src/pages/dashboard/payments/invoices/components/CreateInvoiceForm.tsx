import {
  useForm,
  Form,
  ValidationRules,
  Button,
  Table,
  InputFilters,
  LinkButton,
  useFormMessages,
  Section,
  ValueConverters
} from '@duely/react';
import {
  useQuery,
  useMutation,
  current_agency_Q,
  agency_stripe_account_Q,
  customers_Q,
  create_invoice_M,
  create_customer_M,
  create_invoiceitem_M,
  agency_stripe_account_invoiceitems_Q
} from '@duely/client';
import { useEffect, useMemo, useState } from 'react';
import { Currency, ElementType, hasProperty, noop, numberToMinorCurrencyAmount } from '@duely/util';

type CreateInvoiceFormFields1 = {
  customer_email_address: string;
  customer_name: string;
};
type CreateInvoiceItemFormFields = {
  price?: string;
  description?: string;
  unit_amount?: number;
  quantity: number;
};
type CreateInvoiceFormFields3 = {
  days_until_due: number;
};

export function CreateInvoiceForm() {
  const form1 = useForm<CreateInvoiceFormFields1>();
  const form_createInvoiceItem = useForm<CreateInvoiceItemFormFields>();
  const form3 = useForm<CreateInvoiceFormFields3>();
  const [newItemType, setNewItemType] = useState<'price' | 'one_time'>();

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
  const [createInvoiceItem, stateInvoiceItem] = useMutation(create_invoiceitem_M);
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

  const customer_email_address = form1.useFormFieldValue('customer_email_address');

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

  const { data: invoiceitems, loading: invoiceitemsLoading } = useQuery(
    agency_stripe_account_invoiceitems_Q,
    { agency_id: agency?.id!, customer: customer?.id },
    { skip: !agency || customersLoading || !customer?.id }
  );

  type TInvoiceItem = ElementType<typeof invoiceitems>;

  type TNewInvoiceItem = {};

  const newInvoiceItem = {};

  const items: (TInvoiceItem | TNewInvoiceItem)[] = [...(invoiceitems ?? [])];

  if (newInvoiceItem) {
    items.push(newInvoiceItem);
  }

  useEffect(() => {
    form1.setValue('customer_name', customer?.name ?? '');
  }, [customer?.id]);

  const state = {
    loading: stateInvoice.loading || agencyLoading || stripe_accountLoading,
    error: stateInvoice.error,
    success: stateInvoice.data?.success
  };

  async function onSubmitCreateInvoiceItem({
    price,
    description,
    unit_amount,
    quantity
  }: CreateInvoiceItemFormFields) {
    console.log(price, description, unit_amount, quantity);
    // if (!value.items?.length) {
    //   setErrorMessage('Items are required.');
    //   return;
    // }
    // if (!customer) {
    //   const res_customer = await createCustomer({
    //     stripe_account_id: stripe_account!.id,
    //     email_address: customer_email_address,
    //     name: customer_name
    //   });
    //   if (!res_customer?.success) {
    //     setErrorMessage('Error while creating customer:' + res_customer?.message);
    //     return;
    //   }
    //   customer = res_customer.customer!;
    // }
    // console.log(value);
    // const items = value.items.map((item) => ({
    //   unit_amount: numberToMinorCurrencyAmount(item.unit_amount, currency as Currency),
    //   quantity: item.quantity,
    //   description: item.description
    // }));
    // const res_invoice = await createInvoice({
    //   stripe_account_id: stripe_account!.id,
    //   customer: customer!.default_stripe_customer.id,
    //   auto_advance: false,
    //   collection_method: 'send_invoice',
    //   days_until_due: value.days_until_due,
    //   currency,
    //   items
    // });
    // if (!res_invoice?.success) {
    //   setErrorMessage('Error while creating invoice:' + res_invoice?.message);
    //   return;
    // }
    // setSuccessMessage(`Invoice created successfully`);
  }

  async function onSubmit({ ...value }: CreateInvoiceFormFields3) {
    // if (!value.items?.length) {
    //   setErrorMessage('Items are required.');
    //   return;
    // }
    // if (!customer) {
    //   const res_customer = await createCustomer({
    //     stripe_account_id: stripe_account!.id,
    //     email_address: customer_email_address,
    //     name: customer_name
    //   });
    //   if (!res_customer?.success) {
    //     setErrorMessage('Error while creating customer:' + res_customer?.message);
    //     return;
    //   }
    //   customer = res_customer.customer!;
    // }
    // console.log(value);
    // const items = value.items.map((item) => ({
    //   unit_amount: numberToMinorCurrencyAmount(item.unit_amount, currency as Currency),
    //   quantity: item.quantity,
    //   description: item.description
    // }));
    // const res_invoice = await createInvoice({
    //   stripe_account_id: stripe_account!.id,
    //   customer: customer!.default_stripe_customer.id,
    //   auto_advance: false,
    //   collection_method: 'send_invoice',
    //   days_until_due: value.days_until_due,
    //   currency,
    //   items
    // });
    // if (!res_invoice?.success) {
    //   setErrorMessage('Error while creating invoice:' + res_invoice?.message);
    //   return;
    // }
    // setSuccessMessage(`Invoice created successfully`);
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

  return (
    <>
      <h2 className="mb-4 text-xl font-medium">Create an invoice</h2>
      <Form form={form1} onSubmit={noop} className="flex flex-col space-y-3">
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
      </Form>

      <Form
        form={form_createInvoiceItem}
        onSubmit={onSubmitCreateInvoiceItem}
        className="flex flex-col space-y-3"
      >
        <div className="pb-2">
          <Form.Label>Items</Form.Label>
          <div className="flex flex-col pb-3 border-b">
            <Table
              items={items}
              keyField={(item) => (hasProperty(item, 'id') ? item.id : 'new')}
              dense
            >
              <Table.Column header="Description" span={6} justify="stretch">
                {(item: TInvoiceItem | TNewInvoiceItem | null, i) => {
                  if (!item) return null;

                  if (hasProperty(item, 'id')) {
                    return item.description;
                  }

                  return (
                    <Form.Field
                      dense
                      tooltip
                      type="text"
                      name="description"
                      placeholder={`Item ${i + 1}`}
                      registerOptions={{ required: true }}
                    />
                  );
                }}
              </Table.Column>

              <Table.Column header="Unit amount" span={3}>
                {(item: TInvoiceItem | TNewInvoiceItem | null, i) => {
                  if (!item) return null;
                  return (
                    <Form.Field
                      dense
                      tooltip
                      name="unit_amount"
                      type="text"
                      inputMode="numeric"
                      prefix={currencyPrefix}
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

              <Table.Column header="Quantity" span={3}>
                {(item: TInvoiceItem | TNewInvoiceItem | null, i) => {
                  if (!item) return null;
                  return (
                    <Form.Field
                      dense
                      tooltip
                      name="quantity"
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

              <Table.Column header="" span={2}>
                {(item: TInvoiceItem | TNewInvoiceItem | null, i) => {
                  if (!item) return null;
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
        </div>
      </Form>

      <Form form={form3} onSubmit={onSubmit} className="flex flex-col space-y-3">
        <Form.Field
          label="Days until due"
          className="w-24"
          name="days_until_due"
          suffix="days"
          defaultValue="30"
          registerOptions={{
            required: true,
            rules: [ValidationRules.isPositiveInteger],
            inputFilter: InputFilters.integer,
            valueConverter: ValueConverters.number
          }}
        />

        <Form.Field label="Message to customer" name="description" type="textarea" rows={6} />

        <div className="flex flex-row items-center pt-3 space-x-8">
          <Form.Button>Create invoice</Form.Button>
          <Form.InfoMessage error={errorMessage} info={infoMessage} success={successMessage} />
        </div>
      </Form>
    </>
  );
}
