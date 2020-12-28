import { service_Q, update_service_M, useMutation, useQuery } from '@duely/client';
import {
  Form,
  FormButton,
  FormField,
  FormInfoMessage,
  useFormMessages} from '@duely/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

type ServiceProps = {
  service_id: string;
};

type UpdateServiceStatusFormFields = {
  status: string;
};

export function UpdateServiceStatusForm({ service_id }: ServiceProps) {
  const form = useForm<UpdateServiceStatusFormFields>();
  const { data: service, loading: serviceLoading } = useQuery(service_Q, { service_id });
  const [updateService, stateUpdate] = useMutation(update_service_M);
  const {
    infoMessage,
    setInfoMessage,
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage
  } = useFormMessages();

  const state = {
    loading: serviceLoading || stateUpdate.loading
  };

  const reset = form.reset;

  useEffect(() => {
    if (!service) return;
    reset({
      status: service.default_variant.status
    });
  }, [reset, service]);

  async function onSubmit({ status }: UpdateServiceStatusFormFields) {
    if (status === service?.default_variant.status) {
      setInfoMessage('No changes to be saved');
      form.reset();
      return;
    }

    const res = await updateService({ service_id, status });

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
          name="status"
          type="radio-toggle"
          options={[
            'draft',
            { value: 'live', className: 'bg-gradient-to-r from-green-400 to-green-300' }
          ]}
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
