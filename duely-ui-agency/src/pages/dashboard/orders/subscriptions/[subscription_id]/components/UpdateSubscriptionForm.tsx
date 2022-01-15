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
  subscription_Q,
  // update_subscription_M,
  // agency_stripe_account_subscriptionitems_Q
} from '@duely/client';
import { useEffect, useMemo } from 'react';
import {
  pick,
  diff,
  hasOwnProperty,
  ElementType,
  minorCurrencyAmountToNumber,
  Currency,
  timestampToDate,
  omitUndefined,
  dateToTimestamp,
  formatDate,
  createUpdateArgs
} from '@duely/util';
type SubscriptionProps = {
  subscription_id: string;
};

type UpdateSubscriptionFormFields = {
  customer_email_address: string;
  customer_name: string;
  days_until_due: string;
  description?: string;
  items: {
    description: string;
    unit_amount: number;
    quantity: number;
  }[];
};

export function UpdateSubscriptionForm({ subscription_id }: SubscriptionProps) {
  const form = useForm<UpdateSubscriptionFormFields>();
  const { data: agency, loading: agencyLoading } = useQuery(current_agency_Q);
  const { data: stripe_account, loading: stripe_accountLoading } = useQuery(
    agency_stripe_account_Q,
    { agency_id: agency!.id },
    { skip: !agency }
  );
  const { data: subscription, loading: subscriptionLoading } = useQuery(
    subscription_Q,
    { stripe_account_id: stripe_account?.id!, subscription_id },
    { skip: !stripe_account }
  );
  // const { data: subscriptionitems, loading: subscriptionitemsLoading } = useQuery(
  //   agency_stripe_account_subscriptionitems_Q,
  //   { agency_id: agency?.id!, subscription: subscription_id },
  //   { skip: !agency || !subscription }
  // );

  const currency = agency?.default_pricing_currency ?? stripe_account?.default_currency;

  const currencyPrefix: React.ReactChild = <span className="pr-1">{currency?.toUpperCase()}</span>;

  // const [updateSubscription, stateUpdate] = useMutation(update_subscription_M);
  // const {
  //   infoMessage,
  //   setInfoMessage,
  //   successMessage,
  //   setSuccessMessage,
  //   errorMessage,
  //   setErrorMessage
  // } = useFormMessages();

  // const state = {
  //   loading: subscriptionLoading || stateUpdate.loading
  // };

  async function onSubmit({ ...data }: UpdateSubscriptionFormFields) {
    // TODO: update items

    // const updateSubscriptionArgs = createUpdateArgs(subscription!, data);

    // if (updateSubscriptionArgs.due_date) {
    //   updateSubscriptionArgs.due_date = dateToTimestamp(updateSubscriptionArgs.due_date) as any;
    // }

    // console.log(updateSubscriptionArgs);

    // if (Object.keys(updateSubscriptionArgs).length === 0) {
    //   setInfoMessage('No changes to be saved');
    //   form.reset();
    //   return;
    // }

    // const res = await updateSubscription({
    //   stripe_account_id: stripe_account?.id!,
    //   subscription_id,
    //   ...updateSubscriptionArgs
    // });

    // if (res?.success) {
    //   setSuccessMessage('Saved');
    //   return;
    // } else {
    //   setErrorMessage(res?.message ?? 'Unable to save changes. Something went wrong.');
    // }
  }

  // const { fields, addItem, removeItem } = form.useFieldArray('items', {
  //   items: subscriptionitems,
  //   loading: subscriptionitemsLoading,
  //   keyField: 'id'
  // });

  // type SubscriptionItem = ElementType<NonNullable<typeof subscriptionitems>>;

  return (
    <>
      <Form form={form} onSubmit={onSubmit} className="flex flex-col space-y-3">
        <div className="pb-2">
          <Form.Label className="inline-block pb-1">Customer</Form.Label>
          <div className="flex flex-col -m-2 sm:flex-row">
            <div className="flex-1 p-2">
              {/* <Form.Field
                defaultValue={subscription?.customer_email}
                label="Email address"
                className="max-w-xl"
                name="customer_email_address"
                readOnly
              /> */}
            </div>

            <div className="flex-1 p-2">
              {/* <Form.Field
                defaultValue={subscription?.customer_name}
                label="Name"
                className="max-w-xl"
                name="customer_name"
                readOnly
              /> */}
            </div>
          </div>
        </div>

        {/* <Form.Field
          label="Due Date"
          className="w-48"
          name="due_date"
          type="date"
          defaultValue={subscription?.due_date}
          registerOptions={{
            required: true
          }}
        /> */}

        <div className="pb-2">
          <Form.Label>Items</Form.Label>
          <div className="flex flex-col pb-3 border-b">
            {/* <Table items={fields} keyField="key"> */}
              {/* <Table.Column header="Description" span={6}>
                {(field: FieldArrayItem<SubscriptionItem> | null, i) => {
                  if (!field) return null;
                  return (
                    <Form.Field
                      defaultValue={field.item?.description}
                      type="text"
                      name={field.getName('description')}
                      placeholder={`Item ${i + 1}`}
                      registerOptions={{ required: true }}
                    />
                  );
                }}
              </Table.Column>

              <Table.Column header="Unit amount" span={3}>
                {(field: FieldArrayItem<SubscriptionItem> | null, i) => {
                  if (!field) return null;
                  return (
                    <Form.Field
                      defaultValue={minorCurrencyAmountToNumber(
                        field.item?.unit_amount ?? 0,
                        currency as Currency
                      )}
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
                {(field: FieldArrayItem<SubscriptionItem> | null, i) => {
                  if (!field) return null;
                  return (
                    <Form.Field
                      name={field.getName('quantity')}
                      type="text"
                      inputMode="numeric"
                      prefix={<span className="pr-1">x</span>}
                      defaultValue={field.item?.quantity}
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
                {(field: FieldArrayItem<SubscriptionItem> | null, i) => {
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
              </Table.Column> */}
            {/* </Table> */}

            <div className="flex">
              {/* <Button type="button" className="text-sm" dense icon="plus.solid" onClick={addItem}>
                Add item
              </Button> */}
            </div>
          </div>
        </div>

        <Form.Field label="Message to subscription" name="description" type="textarea" rows={6} />

        <div className="flex flex-row items-center pt-3 space-x-4">
          <Form.Button dense>Save</Form.Button>
          <Form.Button type="reset" dense>
            Cancel
          </Form.Button>
          {/* <Form.InfoMessage error={errorMessage} info={infoMessage} success={successMessage} /> */}
        </div>
      </Form>
    </>
  );
}
