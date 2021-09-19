import {
  useMutation,
  useQuery,
  current_agency_extended_Q,
  integration_types_Q,
  integration_configs_Q,
  credential_Q,
  create_integration_config_M,
  update_integration_config_M,
  create_credential_M,
  update_credential_M
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
import { Awaited, pick } from '@duely/util';
import { useMemo } from 'react';

type SettingsIntegrationsSettingsFormFields = { integration_type_name: string } & Record<
  string,
  string
>;

export function SettingsIntegrationsSettingsForm() {
  const [createIntegrationConfig, stateIntegrationConfigCreate] = useMutation(
    create_integration_config_M
  );
  const [updateIntegrationConfig, stateIntegrationConfigUpdate] = useMutation(
    update_integration_config_M
  );
  // const [deleteIntegrationConfig, stateIntegrationConfigDelete] = useMutation(delete_integration_config_M);
  const [createCredential, stateCredentialCreate] = useMutation(create_credential_M);
  const [updateCredential, stateCredentialUpdate] = useMutation(update_credential_M);
  // const [deleteCredential, stateCredentialDelete] = useMutation(delete_credential_M);

  const form = useForm<SettingsIntegrationsSettingsFormFields>();

  const { data: current_agency, loading: current_agency_loading } =
    useQuery(current_agency_extended_Q);

  const integration_type_name = form.useFormFieldValue('integration_type_name');

  const { data: integration_types, loading: integration_typesLoading } = useQuery(
    integration_types_Q,
    {
      filter: {
        status: 'live'
      }
    }
  );

  const integration_type = integration_types?.find((t) => t.name === integration_type_name);
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
      skip: !integration_type || !current_agency?.id
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
    loading:
      current_agency_loading ||
      stateIntegrationConfigCreate.loading ||
      stateIntegrationConfigUpdate.loading ||
      stateCredentialCreate.loading ||
      stateCredentialUpdate.loading
  };

  const onSubmit = async ({
    integration_type_name,
    ...data
  }: SettingsIntegrationsSettingsFormFields) => {
    let res_credential:
      | Awaited<ReturnType<typeof createCredential>>
      | Awaited<ReturnType<typeof updateCredential>> = null;

    if (integration_type?.credential_type) {
      const credential_json = JSON.stringify(
        pick(
          data,
          integration_type.credential_type.fields!.map((f) => f.name)
        )
      );

      if (credential == null) {
        res_credential = await createCredential({
          agency_id: current_agency!.id,
          credential_type_id: integration_type.credential_type.id,
          name: `${integration_type.name} credential`,
          data: credential_json
        });
      } else {
        res_credential = await updateCredential({
          credential_id: credential.id,
          data: credential_json
        });
      }
    }

    let res_integration_config:
      | Awaited<ReturnType<typeof createIntegrationConfig>>
      | Awaited<ReturnType<typeof updateIntegrationConfig>> = null;

    const integration_config_json = JSON.stringify(
      pick(
        data,
        integration_type!.config_fields!.map((f) => f.name)
      )
    );

    if (integration_config == null) {
      res_integration_config = await createIntegrationConfig({
        agency_id: current_agency!.id,
        credential_id: res_credential?.credential?.id,
        integration_type_id: integration_type!.id,
        name: integration_type!.name,
        data: integration_config_json
      });
    } else {
      res_integration_config = await updateIntegrationConfig({
        integration_config_id: integration_config.id,
        credential_id: res_credential?.credential?.id,
        data: integration_config_json
      });
    }

    if (res_integration_config?.success) {
      setSuccessMessage('Saved');
      return;
    } else {
      setErrorMessage(
        res_integration_config?.message ?? 'Unable to save changes. Something went wrong.'
      );
    }
  };

  return (
    <Form form={form} onSubmit={onSubmit} className="flex flex-col space-y-3 ">
      <FormField
        name="integration_type_name"
        registerOptions={{ required: true }}
        defaultValue={''}
        label="Integration type"
        className="max-w-sm"
        type="select"
        loading={integration_typesLoading}
        options={integration_types?.map((t) => ({ element: t.title, value: t.name })) ?? []}
        hint="You can integrate the product with third party services by setting integration type and options."
      />

      {integration_type && (
        <>
          <DynamicFormFields
            loading={integration_configsLoading}
            fields={fields ?? []}
            defaultValues={integration_config_values}
            skeletonFieldCount={2}
          />
          {integration_type?.credential_type && (
            <DynamicFormFields
              loading={integration_configsLoading || credentialLoading}
              fields={integration_type.credential_type.fields ?? []}
              defaultValues={credential_values}
              skeletonFieldCount={2}
            />
          )}
        </>
      )}

      <div className="flex flex-row items-center pt-3 space-x-4">
        <FormButton dense>Save</FormButton>
        <FormButton type="reset" dense>
          Cancel
        </FormButton>
        <FormInfoMessage error={errorMessage} info={infoMessage} success={successMessage} />
      </div>
    </Form>
  );
}
