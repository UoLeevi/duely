import { integration_types_Q, useQuery } from '@duely/client';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Util } from '..';
import { LoadingScreen } from '../components';
import {
  Form,
  FormButton,
  FormField,
  FormInfoMessage,
  FormSection,
  useFormMessages
} from '../components/forms';

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
  }

  console.log(Util.pick(fields[0], ['type', 'name', 'label']))

  return (
    <div className="grid w-screen h-screen place-items-center bg-gray-25">
      <Form form={form} onSubmit={onSubmit} className="flex flex-col w-screen max-w-screen-sm space-y-3">
        {fields.map((field) => (
          <FormField
            key={field.id}
            form={form}
            type={field.type}
            name={field.name}
            label={field.label}
          />
        ))}

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
