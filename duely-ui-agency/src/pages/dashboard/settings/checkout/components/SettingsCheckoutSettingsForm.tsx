import {
  agency_settings_Q,
  current_agency_Q,
  update_agency_settings_M,
  useMutation,
  useQuery
} from '@duely/client';
import { Form, useFormMessages, useForm } from '@duely/react';

type SettingsCheckoutSettingsFormValues = {
  checkout_success_url: string;
  checkout_cancel_url: string;
};

export function SettingsCheckoutSettingsForm() {
  const [updateSetting, stateUpdate] = useMutation(update_agency_settings_M);

  const form = useForm<SettingsCheckoutSettingsFormValues>();

  const { data: current_agency, loading: agencyLoading } = useQuery(current_agency_Q);
  const { data: agency_settings, loading: settingsLoading } = useQuery(
    agency_settings_Q,
    {
      agency_id: current_agency!.id
    },
    {
      skip: !current_agency
    }
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
    loading: stateUpdate.loading
  };

  const onSubmit = async ({
    checkout_success_url,
    checkout_cancel_url
  }: SettingsCheckoutSettingsFormValues) => {
    checkout_success_url = checkout_success_url.trim() || '';
    checkout_cancel_url = checkout_cancel_url.trim() || '';

    if (checkout_success_url !== '') {
      checkout_success_url = `https://${checkout_success_url}`;
    }

    if (checkout_cancel_url !== '') {
      checkout_cancel_url = `https://${checkout_cancel_url}`;
    }

    if (
      checkout_success_url === (agency_settings?.checkout_success_url ?? '') &&
      checkout_cancel_url === (agency_settings?.checkout_cancel_url ?? '')
    ) {
      setInfoMessage('No changes to be saved');
      form.reset();
      return;
    }

    let res = await updateSetting({
      checkout_success_url,
      checkout_cancel_url,
      setting_id: agency_settings!.id
    });

    if (res?.success) {
      setSuccessMessage('Saved');
      return;
    } else {
      setErrorMessage(res?.message ?? 'Unable to save changes. Something went wrong.');
    }
  };

  return (
    <Form form={form} onSubmit={onSubmit} className="flex flex-col space-y-3">
      <Form.Field
        defaultValue={agency_settings?.checkout_success_url?.replace('https://', '') ?? undefined}
        name="checkout_success_url"
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

      <Form.Field
        defaultValue={agency_settings?.checkout_cancel_url?.replace('https://', '') ?? undefined}
        name="checkout_cancel_url"
        className="max-w-xl"
        label="Checkout cancelled redirect URL"
        prefix="https://"
        loading={settingsLoading}
        hint={
          <span>
            Your customers will be redirected here after cancelled checkout.
            <br />
            This defalt URL can also be overriden on per product level in product settings.
          </span>
        }
      />

      <div className="flex flex-row items-center pt-3 space-x-4">
        <Form.Button dense>Save</Form.Button>
        <Form.Button type="reset" dense>
          Cancel
        </Form.Button>
        <Form.InfoMessage error={errorMessage} info={infoMessage} success={successMessage} />
      </div>
    </Form>
  );
}
