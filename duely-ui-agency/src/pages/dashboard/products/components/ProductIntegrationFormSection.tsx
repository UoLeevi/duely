import {
  current_agency_Q,
  integration_configs_Q,
  integration_type_Q,
  useQuery
} from '@duely/client';
import { FormField, UseFormReturn, DynamicFormFields } from '@duely/react';

type ProductIntegrationFormSectionFields = {
  integration_config_name: string;
} & Record<string, string>;

type ProductIntegrationFormSectionProps<TFieldValues extends ProductIntegrationFormSectionFields> =
  {
    form: UseFormReturn<TFieldValues>;
  };

export function ProductIntegrationFormSection<
  TFieldValues extends ProductIntegrationFormSectionFields
>({ form }: ProductIntegrationFormSectionProps<TFieldValues>) {
  const { data: agency } = useQuery(current_agency_Q);
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

  return (
    <>
      <FormField
        name="integration_config_name"
        defaultValue={''}
        label="Integration type"
        className="max-w-sm"
        type="select"
        loading={integration_configsLoading}
        options={integration_configs?.map((c) => c.name) ?? []}
        hint="You can integrate the product with third party services by setting integration type and options."
      />

      <DynamicFormFields
        loading={integration_typeLoading}
        fields={integration_type?.fields ?? []}
        skeletonFieldCount={1}
      />
    </>
  );
}
