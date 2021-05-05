import { customer_Q, update_customer_M, useMutation, useQuery } from '@duely/client';
import {
  Form,
  FormButton,
  FormField,
  FormInfoMessage,
  useFormMessages,
  Util
} from '@duely/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

type CustomerProps = {
  customer_id: string;
};

type UpdateCustomerBasicInfoFormFields = {
  name: string;
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

  const reset = form.reset;

  useEffect(() => {
    if (!customer) return;
    reset({
      name: customer.name!,
      email_address: customer.email_address
    });
  }, [reset, customer, customer?.name, customer?.email_address]);

  async function onSubmit({ ...data }: UpdateCustomerBasicInfoFormFields) {
    const update = {
      ...Util.diff(Util.pick(data, customer!), customer!)
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

        <div className="flex flex-row items-center pt-3 space-x-4">
          <FormButton form={form} spinner dense loading={state.loading}>
            Save
          </FormButton>
          <FormButton form={form} type="reset" dense disabled={state.loading}>
            Cancel
          </FormButton>
          <FormInfoMessage error={errorMessage} info={infoMessage} success={successMessage} />
        </div>
      </Form>
    </>
  );
}
