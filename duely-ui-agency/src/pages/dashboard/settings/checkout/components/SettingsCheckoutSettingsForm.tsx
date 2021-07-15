import {
  agency_thank_you_page_settings_Q,
  create_agency_thank_you_page_setting_M,
  current_agency_Q,
  delete_agency_thank_you_page_setting_M,
  update_agency_thank_you_page_setting_M,
  useMutation,
  useQuery
} from '@duely/client';
import { MutationResult } from '@duely/core';
import { Form, FormButton, FormField, FormInfoMessage, useFormMessages, useForm } from '@duely/react';

type SettingsCheckoutSettingsFormValues = { url: string };

export function SettingsCheckoutSettingsForm() {
  const [createSetting, stateCreate] = useMutation(create_agency_thank_you_page_setting_M);
  const [updateSetting, stateUpdate] = useMutation(update_agency_thank_you_page_setting_M);
  const [deleteSetting, stateDelete] = useMutation(delete_agency_thank_you_page_setting_M);

  const form = useForm<SettingsCheckoutSettingsFormValues>();

  const { data: current_agency } = useQuery(current_agency_Q);
  const { data: agency_thank_you_page_settings, loading: settingsLoading } = useQuery(
    agency_thank_you_page_settings_Q,
    { agency_id: current_agency!.id }
  );

  const {
    infoMessage,
    setInfoMessage,
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage
  } = useFormMessages();

  const state = {
    loading: stateCreate.loading || stateUpdate.loading || stateDelete.loading
  };

  const onSubmit = async ({ url }: SettingsCheckoutSettingsFormValues) => {
    url = url.trim();

    if (url === '') {
      if (agency_thank_you_page_settings == null) {
        return;
      } else {
        await deleteSetting({ setting_id: agency_thank_you_page_settings.id });
      }
    } else {
      url = `https://${url}`;

      if (url === agency_thank_you_page_settings?.url) {
        setInfoMessage('No changes to be saved');
        form.reset();
        return;
      }

      let res: MutationResult | null | undefined;

      if (agency_thank_you_page_settings == null) {
        res = await createSetting({ url, agency_id: current_agency!.id });
      } else {
        res = await updateSetting({ url, setting_id: agency_thank_you_page_settings.id });
      }

      if (res?.success) {
        setSuccessMessage('Saved');
        return;
      } else {
        setErrorMessage(res?.message ?? 'Unable to save changes. Something went wrong.');
      }
    }
  };

  return (
    <Form form={form} onSubmit={onSubmit} className="flex flex-col space-y-3">
      <FormField
        defaultValue={agency_thank_you_page_settings?.url?.replace('https://', '') ?? undefined}
        name="url"
        className="max-w-xl"
        label="Thank you page URL"
        prefix="https://"
        loading={settingsLoading}
        hint={
          <span>
            Your customers will be redirected here after successful checkout.
            <br />
            This defalt URL can also be overriden on per product level in product settings.
          </span>
        }
      />

      <div className="flex flex-row items-center pt-3 space-x-4">
        <FormButton dense>
          Save
        </FormButton>
        <FormButton type="reset" dense>
          Cancel
        </FormButton>
        <FormInfoMessage error={errorMessage} info={infoMessage} success={successMessage} />
      </div>
    </Form>
  );
}
