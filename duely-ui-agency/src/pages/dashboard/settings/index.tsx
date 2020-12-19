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
import { SubmitHandler, useForm } from 'react-hook-form';
import { DashboardSection } from '../components';

type SettingsCheckoutSettingsFormValues = { url: string };

function SettingsCheckoutSettingsForm() {
  const [createSetting, stateCreate] = useMutation(create_agency_thank_you_page_setting_M);
  const [updateSetting, stateUpdate] = useMutation(update_agency_thank_you_page_setting_M);
  const [deleteSetting, stateDelete] = useMutation(delete_agency_thank_you_page_setting_M);
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

  const form = useForm<SettingsCheckoutSettingsFormValues>({
    defaultValues: {
      url: agency_thank_you_page_settings?.url
    }
  });

  const onSubmit: SubmitHandler<SettingsCheckoutSettingsFormValues> = async ({ url }) => {};

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
        <FormButton dense loading={state.loading}>Save</FormButton>
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
          <div className="relative flex flex-col px-5 pt-4 pb-5 -m-2 xl:-m-4 xl:flex-row">
            <div className="flex flex-col items-start m-2 space-y-1 xl:m-4 xl:w-1/3 2xl:w-1/4">
              <h3 className="font-bold tracking-wide text-gray-700 underline-highlight-accent">Checkout</h3>
              <span className="text-sm text-gray-500">
                You can set up a custom thank you page URL or use the one provided by Duely
              </span>
            </div>
            <div className="flex flex-col m-2 xl:m-4 xl:w-2/3 2xl:w-3/4">
              <SettingsCheckoutSettingsForm />
            </div>
          </div>
        </Card>
      </DashboardSection>
    </>
  );
}
