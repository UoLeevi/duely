import {
  agency_thank_you_page_settings_Q,
  create_agency_thank_you_page_setting_M,
  current_agency_Q,
  delete_agency_thank_you_page_setting_M,
  update_agency_thank_you_page_setting_M,
  useMutation,
  useQuery
} from '@duely/client';
import { Card, FormButton, FormErrorInfo, FormField } from '@duely/react';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { DashboardSection } from '../components';
import { FormSection } from '../components/FormSection';

type SettingsCheckoutSettingsFormValues = { url: string };

function SettingsCheckoutSettingsForm() {
  const [createSetting, stateCreate] = useMutation(create_agency_thank_you_page_setting_M);
  const [updateSetting, stateUpdate] = useMutation(update_agency_thank_you_page_setting_M);
  const [deleteSetting, stateDelete] = useMutation(delete_agency_thank_you_page_setting_M);

  const form = useForm<SettingsCheckoutSettingsFormValues>();

  const { data: current_agency } = useQuery(current_agency_Q);
  const {
    data: agency_thank_you_page_settings,
    loading: settingsLoading
  } = useQuery(agency_thank_you_page_settings_Q, { agency_id: current_agency!.id });

  const state = {
    loading: stateCreate.loading || stateUpdate.loading || stateDelete.loading,
    error: stateCreate.error || stateUpdate.error || stateDelete.error,
    success: stateCreate.data?.success || stateUpdate.data?.success || stateDelete.data?.success
  };

  useEffect(() => {
    if (settingsLoading || state.loading) return;
    form.setValue('url', agency_thank_you_page_settings?.url?.replace('https://', ''));
  }, [agency_thank_you_page_settings?.url, form, settingsLoading, state.loading]);

  const onSubmit: SubmitHandler<SettingsCheckoutSettingsFormValues> = async ({ url }) => {
    url = url.trim();

    if (url === '') {
      if (agency_thank_you_page_settings == null) {
        return;
      } else {
        await deleteSetting({ setting_id: agency_thank_you_page_settings.id });
      }
    } else {
      url = `https://${url}`;

      if (agency_thank_you_page_settings == null) {
        await createSetting({ url, agency_id: current_agency!.id });
      } else {
        await updateSetting({ url, setting_id: agency_thank_you_page_settings.id });
      }
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-3">
      <FormField
        form={form}
        name="url"
        className="max-w-xl"
        label="Thank you page URL"
        prefix="https://"
        loading={settingsLoading}
        hint={
          <span>
            Your customers will be redirected here after successful checkout.
            <br />
            This defalt URL can also be overriden on per service level in service settings.
          </span>
        }
      />
      <div className="flex flex-row items-center pt-3 space-x-8">
        <FormButton dense loading={state.loading}>
          Save
        </FormButton>
        <FormErrorInfo error={state.error} />
      </div>
    </form>
  );
}

export default function DashboardSettings() {
  return (
    <>
      <DashboardSection title="Settings">
        <Card>
          <FormSection
            title="Checkout"
            description="You can set up a custom thank you page URL or use the one provided by Duely"
          >
            <SettingsCheckoutSettingsForm />
          </FormSection>
        </Card>
      </DashboardSection>
    </>
  );
}
