import { customer_Q, update_customer_M, useMutation, useQuery } from '@duely/client';
import { Form, useFormMessages, useForm } from '@duely/react';
import { diff, pick } from '@duely/util';

type CustomerProps = {
  customer_id: string;
};

type UpdateCustomerBasicInfoFormFields = {
  name: string | null;
  email_address: string;
};

export function UpdateCustomerBasicInfoForm({ customer_id }: CustomerProps) {
  const form = useForm<UpdateCustomerBasicInfoFormFields>();
  const { data: customer, loading: customerLoading } = useQuery(customer_Q, { customer_id });
  const [updateCustomer, stateUpdate] = useMutation(update_customer_M);
  const {
    infoMessage,
    setInfoMessage,
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage
  } = useFormMessages();

  const state = {
    loading: customerLoading || stateUpdate.loading
  };

  async function onSubmit({ ...data }: UpdateCustomerBasicInfoFormFields) {
    const update = {
      ...diff(pick(data, customer!), customer!)
    };

    if (Object.keys(update).length === 0) {
      setInfoMessage('No changes to be saved');
      form.reset();
      return;
    }

    const res = await updateCustomer({ customer_id, ...update });

    if (res?.success) {
      setSuccessMessage('Saved');
      return;
    } else {
      setErrorMessage(res?.message ?? 'Unable to save changes. Something went wrong.');
    }
  }

  return (
    <>
      <Form form={form} onSubmit={onSubmit} className="flex flex-col space-y-3">
        <Form.Field
          defaultValue={customer?.name}
          label="Customer name"
          className="max-w-xl"
          name="name"
          type="text"
          registerOptions={{ required: true }}
        />
        <Form.Field
          defaultValue={customer?.email_address}
          label="Email address"
          className="max-w-xl"
          name="email_address"
          type="email"
          registerOptions={{ required: true }}
        />

        <div className="flex flex-row items-center pt-3 space-x-4">
          <Form.Button dense>Save</Form.Button>
          <Form.Button type="reset" dense>
            Cancel
          </Form.Button>
          <Form.InfoMessage error={errorMessage} info={infoMessage} success={successMessage} />
        </div>
      </Form>
    </>
  );
}
