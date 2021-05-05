import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormButton, FormField, FormInfoMessage, useFormMessages } from '../components/forms';

export default function App() {
  const form = useForm<{
    name: string;
    description: string;
    url_name: string;
    toggle: string;
  }>();

  useEffect(() => {
    form.reset({ toggle: 'draft' });
  }, []);

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
    setSuccessMessage('Saved');
  }

  return (
    <div className="grid w-screen h-screen place-items-center bg-gray-25">
      <Form form={form} onSubmit={onSubmit} className="flex flex-col space-y-3">
        <FormField
          form={form}
          label="Product name"
          className="max-w-xl"
          name="name"
          type="text"
          registerOptions={{ required: true }}
        />
        <FormField
          form={form}
          label="URL friendly name"
          className="max-w-xl"
          name="url_name"
          type="text"
          prefix="/products/"
          hint={
            <span>
              <span>How product name should appear in URLs.</span>
              <br />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="inline h-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">
                Note that changing the URL causes external links to break.
              </span>
            </span>
          }
          registerOptions={{ required: true }}
        />
        <FormField
          form={form}
          label="Description"
          className="max-w-xl"
          name="description"
          type="textarea"
          rows={5}
          registerOptions={{ required: true }}
        />

        <FormField
          form={form}
          label="Toggle"
          name="toggle"
          type="radio-toggle"
          options={[
            'draft',
            { value: 'live', className: 'bg-gradient-to-r from-green-400 to-green-300' }
          ]}
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
