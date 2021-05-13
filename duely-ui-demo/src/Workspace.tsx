import { integration_types_Q, useQuery } from '@duely/client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  LoadingScreen,
  Form,
  FormButton,
  FormInfoMessage,
  DynamicFormFields,
  useFormMessages
} from '@duely/react';
import React from 'react';

export default function Workspace() {
  const { data: integration_types, loading: integration_typesLoading } = useQuery(
    integration_types_Q,
    {
      filter: {
        name: 'teachable/enroll'
      }
    }
  );

  const integration_type = integration_types?.[0];
  const fields = integration_type?.fields;

  const form = useForm();

  const [{ values, loading }, setState] = useState<any>({ values: undefined, loading: true });

  useEffect(() => {
    // Lets simulate loading of initial data
    setTimeout(() => {
      setState({
        values: {
          school_domain: 'example.com'
        },
        loading: false
      });
    }, 3000);
  }, []);

  const {
    infoMessage,
    setInfoMessage,
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage
  } = useFormMessages();

  if (integration_typesLoading || !fields) return <LoadingScreen />;

  const state = {
    loading: false
  };

  async function onSubmit(data: any) {
    console.log('submitted:', data);
    setSuccessMessage('Saved');
    setState({
      values: data,
      loading: false
    });
  }

  return (
    <div className="grid w-screen h-screen place-items-center bg-gray-25">
      <Form
        form={form}
        onSubmit={onSubmit}
        className="flex flex-col w-screen max-w-screen-sm space-y-3"
      >
        <DynamicFormFields
          loading={loading}
          form={form}
          fields={fields}
          values={values}
          skeletonFieldCount={2}
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
    </div>
  );
}
