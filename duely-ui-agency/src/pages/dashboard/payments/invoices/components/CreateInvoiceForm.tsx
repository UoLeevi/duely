import {
  FormButton,
  FormField,
  useForm,
  Form,
  ValidationRules,
  Button,
  Table,
  InputFilters,
  FieldArrayItem
} from '@duely/react';
import {
  useQuery,
  // create_invoice_M,
  current_agency_Q,
  agency_stripe_account_Q,
  customers_Q
} from '@duely/client';
import { useMemo } from 'react';

type CreateInvoiceFormFields = {
  customer_email_address: string;
  message?: string;
  items: {
    name: string;
    amount: number;
  }[];
};

export function CreateInvoiceForm() {
  const form = useForm<CreateInvoiceFormFields>();
  // const [createInvoice, stateInvoice] = useMutation(create_invoice_M);
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

    return customerSuggestions.map((customer) => ({
      element: (
        <span>
          <span>{customer.email_address}</span>
          {customer.name && <span className="text-gray-500"> - {customer.name}</span>}
        </span>
      ),
      value: customer.email_address
    }));
  }, [customer_email_address, customers]);

  const state = {
    // loading: stateInvoice.loading || agencyLoading || stripe_accountLoading,
    // error: stateInvoice.error,
    // success: stateInvoice.data?.success
  };

  async function onSubmit({ ...value }: CreateInvoiceFormFields) {
    console.log(value);

    // const res_invoice = await createInvoice({
    //   stripe_account_id: stripe_account!.id,
    //   name,
    //   email_address
    // });
    // if (!res_invoice?.success) return;
  }

  // if (state.success) {
  //   const { invoice } = stateInvoice.data!;
  //   return (
  //     <div className="flex flex-col items-center space-y-4 text-center">
  //       <div className="grid w-12 h-12 bg-green-200 rounded-full place-items-center">
  //         <svg
  //           xmlns="http://www.w3.org/2000/svg"
  //           className="text-3xl text-green-600 h-[1em] w-[1em]"
  //           fill="none"
  //           viewBox="0 0 24 24"
  //           stroke="currentColor"
  //         >
  //           <path
  //             strokeLinecap="round"
  //             strokeLinejoin="round"
  //             strokeWidth={1.5}
  //             d="M5 13l4 4L19 7"
  //           />
  //         </svg>
  //       </div>
  //       <h3 className="text-2xl font-semibold">
  //         <span className="whitespace-nowrap">Invoice</span>{' '}
  //         <span className="whitespace-nowrap">{invoice!.name}</span>{' '}
  //         <span className="whitespace-nowrap">created succesfully</span>
  //       </h3>
  //       <LinkButton color="indigo" to="/dashboard/invoices">
  //         Go to invoices
  //       </LinkButton>
  //     </div>
  //   );
  // }

  const customer = customer_email_address
    ? customers?.find(
        (customer) => customer.email_address.toLowerCase() === customer_email_address.toLowerCase()
      )
    : undefined;

  const {fields, addItem, removeItem} = form.useFieldArray('items');

  return (
    <>
      <h2 className="mb-3 text-xl font-medium">Create an invoice</h2>
      <Form form={form} onSubmit={onSubmit} className="flex flex-col space-y-3">
        <FormField
          label="Customer"
          className="max-w-xl"
          name="customer_email_address"
          suggestions={customerSuggestions}
          suffix={customer?.name}
          registerOptions={{ required: true }}
        />

        <div className="pb-2">
          <span className="font-medium text-gray-700">Items</span>
          <div className="flex flex-col pb-3 border-b">
            <Table items={fields}>
              <Table.Column header="Name">
                {(field: FieldArrayItem | null, i) => {
                  if (!field) return null;
                  return (
                    <FormField
                      type="text"
                      name={field.getName('name')}
                      placeholder={`Item ${i + 1}`}
                      registerOptions={{ required: true }}
                    />
                  );
                }}
              </Table.Column>

              <Table.Column header="Amount">
                {(field: FieldArrayItem | null, i) => {
                  if (!field) return null;
                  return (
                    <FormField
                      name={field.getName('amount')}
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

              <Table.Column header="">
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

        <FormField label="Message to customer" name="message" type="textarea" rows={6} />

        <div className="flex flex-row items-center pt-3 space-x-8">
          <FormButton>Create invoice</FormButton>
          {/* <FormInfoMessage error={state.error} /> */}
        </div>
      </Form>
    </>
  );
}
