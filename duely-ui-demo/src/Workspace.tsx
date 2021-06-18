import { integration_types_Q, useQuery } from '@duely/client';
import { useState } from 'react';
import {
  Form,
  FormButton,
  FormInfoMessage,
  DynamicFormFields,
  useFormMessages,
  FormField,
  useForm
} from '@duely/react';

let renderCount = 0;

export default function Workspace() {
  const form = useForm();
  const integration_type_name = form.useFormFieldValue('integration_type_name');
  const product_id = form.useFormFieldValue('product_id');
  const { isSubmitting } = form.useFormState();

  console.log(++renderCount, integration_type_name, product_id, isSubmitting)

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

  function onSubmit(data: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        setValues(data);
        console.log('submitted:', data);
        setSuccessMessage('Saved');
        resolve(data);
      }, 3000);
    });
  }

  return (
    <div className="grid w-screen min-h-screen place-items-center bg-gray-25">
      <Form
        form={form}
        onSubmit={onSubmit}
        className="flex flex-col w-screen max-w-screen-sm space-y-3 min-h-[60vh] p-6 box-border"
      >
        <FormField
          name="integration_type_name"
          registerOptions={{ required: true }}
          defaultValue={''}
          label="Integration type"
          type="select"
          options={[{ element: 'Teachable', value: 'teachable/enroll' }]}
          hint="You can integrate the product with third party services by setting integration type and options."
        />

        <DynamicFormFields
          loading={loading ?? integration_typesLoading}
          fields={fields ?? []}
          skeletonFieldCount={2}
        />

        <div className="flex flex-row items-center pt-3 space-x-4">
          <FormButton dense loading={isSubmitting}>
            Save
          </FormButton>
          <FormButton type="reset" dense disabled={isSubmitting}>
            Cancel
          </FormButton>
          <FormInfoMessage error={errorMessage} info={infoMessage} success={successMessage} />
        </div>
      </Form>
    </div>
  );
}
