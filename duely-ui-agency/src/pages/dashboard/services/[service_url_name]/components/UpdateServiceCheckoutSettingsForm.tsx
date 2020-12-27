import {
  agency_thank_you_page_settings_Q,
  create_service_thank_you_page_setting_M,
  current_agency_Q,
  delete_service_thank_you_page_setting_M,
  service_Q,
  service_thank_you_page_settings_Q,
  update_service_thank_you_page_setting_M,
  useMutation,
  useQuery
} from '@duely/client';
import { MutationResult } from '@duely/core';
import { Form, FormButton, FormField, FormInfoMessage, useFormMessages } from '@duely/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

type ServiceProps = {
  service_id: string;
};

type UpdateServiceCheckoutSettingsFormFields = { url: string };

export function UpdateServiceCheckoutSettingsForm({ service_id }: ServiceProps) {
  const form = useForm<UpdateServiceCheckoutSettingsFormFields>();
  const { data: service, loading: serviceLoading } = useQuery(service_Q, { service_id });
  const {
    data: service_thank_you_page_settings,
    loading: settingsLoading
  } = useQuery(service_thank_you_page_settings_Q, { service_id });
  const { data: current_agency } = useQuery(current_agency_Q);
  const {
    data: agency_thank_you_page_settings,
    loading: agencySettingsLoading
  } = useQuery(agency_thank_you_page_settings_Q, { agency_id: current_agency!.id });

  const [createSetting, stateCreate] = useMutation(create_service_thank_you_page_setting_M);
  const [updateSetting, stateUpdate] = useMutation(update_service_thank_you_page_setting_M);
  const [deleteSetting, stateDelete] = useMutation(delete_service_thank_you_page_setting_M);

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
      serviceLoading ||
      agencySettingsLoading ||
      settingsLoading ||
      stateUpdate.loading ||
      stateCreate.loading ||
      stateDelete.loading
  };

  const reset = form.reset;

  useEffect(() => {
    if (!service_thank_you_page_settings) return;
    reset({
      url: service_thank_you_page_settings?.url?.replace('https://', '')
    });
  }, [reset, service_thank_you_page_settings]);

  async function onSubmit({ url }: UpdateServiceCheckoutSettingsFormFields) {
    url = url.trim();

    if (url === '') {
      if (service_thank_you_page_settings == null) {
        return;
      } else {
        await deleteSetting({ setting_id: service_thank_you_page_settings.id });
      }
    } else {
      url = `https://${url}`;

      if (url === agency_thank_you_page_settings?.url) {
        setInfoMessage('No changes to be saved');
        form.reset();
        return;
      }

      let res: MutationResult | null | undefined;

      if (service_thank_you_page_settings == null) {
        res = await createSetting({ url, service_id });
      } else {
        res = await updateSetting({ url, setting_id: service_thank_you_page_settings.id });
      }

      if (res?.success) {
        setSuccessMessage('Saved');
        return;
      } else {
        setErrorMessage(res?.message ?? 'Unable to save changes. Something went wrong.');
      }
    }
  }

  return (
    <>
      <Form form={form} onSubmit={onSubmit} className="flex flex-col space-y-3">
        <FormField
          form={form}
          name="url"
          className="max-w-xl"
          label="Thank you page URL"
          prefix="https://"
          placeholder={agency_thank_you_page_settings?.url?.replace('https://', '')}
          loading={settingsLoading}
          hint={
            <span>
              Set a thank you page URL for this service. Your customers will be redirected here
              after successful checkout.
            </span>
          }
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
    </>
  );
}
