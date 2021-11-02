import {
  create_integration_M,
  current_agency_Q,
  integration_configs_Q,
  integration_type_Q,
  product_Q,
  useMutation,
  useQuery
} from '@duely/client';
import { Form, useFormMessages, useForm } from '@duely/react';

import { pick } from '@duely/util';
import { ProductIntegrationFormSection } from '../../components/ProductIntegrationFormSection';

type ProductProps = {
  product_id?: string;
};

type CreateProductIntegrationFormFields = {
  integration_config_name: string;
} & Record<string, string>;

export function CreateProductIntegrationForm({ product_id }: ProductProps) {
  const form = useForm<CreateProductIntegrationFormFields>();
  const { data: product, loading: productLoading } = useQuery(
    product_Q,
    { product_id: product_id! },
    { skip: !product_id }
  );

  const { data: agency } = useQuery(current_agency_Q);

  const [createIntegration, stateIntegration] = useMutation(create_integration_M);
  const {
    infoMessage,
    setInfoMessage,
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage
  } = useFormMessages();

  const { data: integration_configs, loading: integration_configsLoading } = useQuery(
    integration_configs_Q,
    { filter: { agency_id: agency!.id } },
    { skip: !agency }
  );

  const integration_config_name = form.useFormFieldValue('integration_config_name');
  const integration_config = integration_configs?.find((c) => c.name === integration_config_name);

  const { data: integration_type, loading: integration_typeLoading } = useQuery(
    integration_type_Q,
    {
      integration_type_id: integration_config?.integration_type?.id!
    },
    {
      skip: !integration_config
    }
  );

  const state = {
    loading: !product_id || productLoading
  };

  async function onSubmit({ ...data }: CreateProductIntegrationFormFields) {
    if (!integration_type) return;

    const integration_json = JSON.stringify(
      pick(
        data,
        integration_type.fields!.map((f) => f.name)
      )
    );

    const res = await createIntegration({
      agency_id: agency!.id,
      integration_config_id: integration_config!.id,
      integration_type_id: integration_type?.id,
      product_id: product!.id,
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
        <ProductIntegrationFormSection form={form} />

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
