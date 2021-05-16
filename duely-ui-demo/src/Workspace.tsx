import { integration_types_Q, useQuery } from '@duely/client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormButton,
  FormInfoMessage,
  DynamicFormFields,
  useFormMessages,
  FormField,
  Button
} from '@duely/react';

export default function Workspace() {
  const defaultValues = {
    integration_type_name: ''
  };

  const form = useForm();

  const integration_type_name = form.watch('integration_type_name');
  console.log(integration_type_name);

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

  const [values, setValues] = useState<any>();
  const [loading, setLoading] = useState(false);

  const {
    infoMessage,
    setInfoMessage,
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage
  } = useFormMessages();

  const state = {
    loading: false
  };

  async function onSubmit(data: any) {
    console.log('submitted:', data);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setValues(data);
      setSuccessMessage('Saved');
    }, 3000);
  }

  return (
    <div className="grid w-screen min-h-screen place-items-center bg-gray-25">
      <Form
        form={form}
        onSubmit={onSubmit}
        values={values}
        defaultValues={defaultValues}
        className="flex flex-col w-screen max-w-screen-sm space-y-3 min-h-[60vh] p-6 box-border"
      >
        <FormField
          form={form}
          name="integration_type_name"
          label="Integration type"
          type="select"
          options={[{ element: 'Teachable', value: 'teachable/enroll' }]}
          hint="You can integrate the product with third party services by setting integration type and options."
        />

        <DynamicFormFields
          loading={loading ?? integration_typesLoading}
          form={form}
          fields={fields ?? []}
          skeletonFieldCount={2}
        />

        <div className="flex flex-row items-center pt-3 space-x-4">
          <FormButton form={form} dense loading={state.loading}>
            Save
          </FormButton>
          <FormButton form={form} type="reset" dense disabled={state.loading}>
            Cancel
          </FormButton>
          <FormInfoMessage error={errorMessage} info={infoMessage} success={successMessage} />
        </div>
      </Form>
    </div>
  );
}
