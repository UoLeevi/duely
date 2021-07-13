import {
  update_agency_M,
  useMutation,
  useQuery,
  current_agency_extended_Q,
  integration_types_Q
} from '@duely/client';
import {
  useForm,
  Form,
  FormButton,
  FormField,
  FormInfoMessage,
  useFormMessages,
  DynamicFormFields
} from '@duely/react';

type SettingsIntegrationsSettingsFormFields = { integration_type_name: string };

export function SettingsIntegrationsSettingsForm() {
  const [updateAgency, stateUpdate] = useMutation(update_agency_M);

  const form = useForm<SettingsIntegrationsSettingsFormFields>();

  const { data: current_agency, loading: current_agency_loading } =
    useQuery(current_agency_extended_Q);

  const integration_type_name = form.useFormFieldValue('integration_type_name');
  const { isSubmitting } = form.useFormState();

  const { data: integration_types, loading: integration_typesLoading } = useQuery(
    integration_types_Q,
    {
      filter: {
        name: integration_type_name
      }
    },
    {
      skip: !integration_type_name
    }
  );
  const integration_type = integration_types?.[0];
  const fields = integration_type?.fields;

  const {
    infoMessage,
    setInfoMessage,
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage
  } = useFormMessages();

  const state = {
    loading: current_agency_loading || stateUpdate.loading
  };

  const onSubmit = async ({ integration_type_name }: SettingsIntegrationsSettingsFormFields) => {
    // const res = await updateAgency({ agency_id: current_agency!.id, default_pricing_currency });
    // if (res?.success) {
    //   setSuccessMessage('Saved');
    //   return;
    // } else {
    //   setErrorMessage(res?.message ?? 'Unable to save changes. Something went wrong.');
    // }
  };

  return (
    <Form form={form} onSubmit={onSubmit} className="flex flex-col space-y-3">
      <FormField
        name="integration_type_name"
        registerOptions={{ required: true }}
        defaultValue={''}
        label="Integration type"
        className="max-w-sm"
        type="select"
        options={[{ element: 'Teachable', value: 'teachable/enroll' }]}
        hint="You can integrate the product with third party services by setting integration type and options."
      />

      <DynamicFormFields
        loading={integration_typesLoading ?? integration_typesLoading}
        fields={fields ?? []}
        skeletonFieldCount={2}
      />

      <div className="flex flex-row items-center pt-3 space-x-4">
        <FormButton dense disabled={state.loading}>
          Save
        </FormButton>
        <FormButton type="reset" dense disabled={state.loading}>
          Cancel
        </FormButton>
        <FormInfoMessage error={errorMessage} info={infoMessage} success={successMessage} />
      </div>
    </Form>
  );
}
