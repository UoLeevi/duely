import {
  agency_thank_you_page_settings_Q,
  create_agency_thank_you_page_setting_M,
  current_agency_Q,
  update_agency_M,
  delete_agency_thank_you_page_setting_M,
  update_agency_thank_you_page_setting_M,
  useMutation,
  useQuery,
  current_agency_extended_Q
} from '@duely/client';
import type { MutationResult } from '@duely/core';
import {
  Card,
  FormButton,
  FormField,
  FormInfoMessage,
  FormSection,
  useFormMessages
} from '@duely/react';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { DashboardSection } from '../components';

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

  const reset = form.reset;

  useEffect(() => {
    if (!agency_thank_you_page_settings) return;
    reset({
      url: agency_thank_you_page_settings?.url?.replace('https://', '')
    });
  }, [reset, agency_thank_you_page_settings]);

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
            This defalt URL can also be overriden on per product level in product settings.
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
    </form>
  );
}

type SettingsMiscellaneousSettingsFormValues = { default_pricing_currency: string };

function SettingsMiscellaneousSettingsForm() {
  const [updateAgency, stateUpdate] = useMutation(update_agency_M);

  const form = useForm<SettingsMiscellaneousSettingsFormValues>();

  const { data: current_agency, loading: current_agency_loading } = useQuery(
    current_agency_extended_Q
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
    loading: current_agency_loading || stateUpdate.loading
  };

  const reset = form.reset;

  useEffect(() => {
    if (!current_agency) return;
    reset({
      default_pricing_currency: current_agency.default_pricing_currency ?? undefined
    });
  }, [reset, current_agency]);

  const onSubmit: SubmitHandler<SettingsMiscellaneousSettingsFormValues> = async ({
    default_pricing_currency
  }) => {
    const res = await updateAgency({ agency_id: current_agency!.id, default_pricing_currency });

    if (res?.success) {
      setSuccessMessage('Saved');
      return;
    } else {
      setErrorMessage(res?.message ?? 'Unable to save changes. Something went wrong.');
    }
  };

  const currencies = current_agency?.supported_payment_currencies
    ?.map((c) => ({ value: c, element: c.toUpperCase() }))
    ?.sort((a, b) => a.element.localeCompare(b.element));

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-3">
      <FormField
        form={form}
        name="default_pricing_currency"
        label="Pricing currency"
        type="select"
        options={currencies}
        loading={current_agency_loading}
        hint={<span>Default currency for newly created products.</span>}
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
            description={
              <span>
                By default, after a successful checkout, customers will be redirected to a default
                thank you page hosted on Duely. Alternatively, you can set custom URLs for the thank
                you pages.
                <br />
                <br />
                Custom thank you page URL can be set on both agency level and on product level. If
                the thank you page URL is set on both agency level and product level, the product
                level setting will be used. To set the thank you page URL on the product level,
                please edit an individual product settings.
              </span>
            }
          >
            <SettingsCheckoutSettingsForm />
          </FormSection>
          <FormSection
            title="Miscellaneous"
            description={
              <span>
                You can change the default currency for your product prices here. The currency set
                will only affect newly created products and prices.
              </span>
            }
          >
            <SettingsMiscellaneousSettingsForm />
          </FormSection>
        </Card>
      </DashboardSection>
    </>
  );
}
