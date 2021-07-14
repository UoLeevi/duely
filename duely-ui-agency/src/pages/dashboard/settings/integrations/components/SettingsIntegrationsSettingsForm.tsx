import {
  update_agency_M,
  useMutation,
  useQuery,
  current_agency_extended_Q,
  integration_types_Q,
  integration_configs_Q,
  credential_Q
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
import { useMemo } from 'react';

type SettingsIntegrationsSettingsFormFields = { integration_type_name: string } & Record<
  string,
  string
>;

export function SettingsIntegrationsSettingsForm() {
  const [updateAgency, stateUpdate] = useMutation(update_agency_M);

  const form = useForm<SettingsIntegrationsSettingsFormFields>();

  const { data: current_agency, loading: current_agency_loading } =
    useQuery(current_agency_extended_Q);

  const integration_type_name = form.useFormFieldValue('integration_type_name');

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
  const fields = integration_type?.config_fields;

  const { data: integration_configs, loading: integration_configsLoading } = useQuery(
    integration_configs_Q,
    {
      filter: {
        integration_type_id: integration_type?.id,
        name: integration_type?.name,
        agency_id: current_agency?.id
      }
    },
    {
      skip: !integration_type
    }
  );

  const integration_config = integration_configs?.[0];
  const integration_config_values = useMemo(
    () => JSON.parse(integration_config?.data ?? null),
    [integration_config?.data]
  );

  const { data: credential, loading: credentialLoading } = useQuery(
    credential_Q,
    {
      credential_id: integration_config?.credential?.id!
    },
    {
      skip: !integration_config?.credential
    }
  );

  const credential_values = useMemo(() => JSON.parse(credential?.data ?? null), [credential?.data]);

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

  const onSubmit = async ({ integration_type_name, ...data }: SettingsIntegrationsSettingsFormFields) => {
    console.log(integration_type_name, data)
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
        loading={integration_typesLoading || integration_configsLoading}
        fields={fields ?? []}
        defaultValues={integration_config_values}
        skeletonFieldCount={2}
      />

      {integration_type?.credential_type && (
        <DynamicFormFields
          loading={integration_typesLoading || integration_configsLoading || credentialLoading}
          fields={integration_type.credential_type.fields ?? []}
          defaultValues={credential_values}
          skeletonFieldCount={2}
        />
      )}

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
