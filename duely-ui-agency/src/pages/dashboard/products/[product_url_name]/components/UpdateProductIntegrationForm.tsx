import {
  integrations_Q,
  integration_type_Q,
  product_Q,
  update_integration_M,
  useMutation,
  useQuery
} from '@duely/client';
import { Form, useFormMessages, useForm, DynamicFormFields } from '@duely/react';

import { pick } from '@duely/util';
import { useMemo } from 'react';

type ProductProps = {
  product_id?: string;
};

type UpdateProductIntegrationFormFields = Record<string, string>;

export function UpdateProductIntegrationForm({ product_id }: ProductProps) {
  const form = useForm<UpdateProductIntegrationFormFields>();
  const { data: product, loading: productLoading } = useQuery(
    product_Q,
    { product_id: product_id! },
    { skip: !product_id }
  );
  const [updateIntegration, stateUpdate] = useMutation(update_integration_M);
  const {
    infoMessage,
    setInfoMessage,
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage
  } = useFormMessages();

  const state = {
    loading: !product_id || productLoading
  };

  const { data: integrations, loading: integrationsLoading } = useQuery(integrations_Q, {
    filter: {
      product_id
    }
  });

  const integration = integrations?.[0];

  const integration_values = useMemo(
    () => JSON.parse(integration?.data ?? null),
    [integration?.data]
  );

  const { data: integration_type, loading: integration_typeLoading } = useQuery(
    integration_type_Q,
    {
      integration_type_id: integration?.integration_type?.id!
    },
    {
      skip: !integration
    }
  );

  async function onSubmit({ ...data }: UpdateProductIntegrationFormFields) {
    const integration_json = JSON.stringify(
      pick(
        data,
        integration_type!.fields!.map((f) => f.name)
      )
    );

    const res = await updateIntegration({
      integration_id: integration!.id,
      data: integration_json
    });

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
        <DynamicFormFields
          loading={integration_typeLoading || integrationsLoading}
          fields={integration_type?.fields ?? []}
          defaultValues={integration_values}
          skeletonFieldCount={1}
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
