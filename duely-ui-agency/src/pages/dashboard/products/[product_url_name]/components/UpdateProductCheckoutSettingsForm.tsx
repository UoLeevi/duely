import {
  agency_settings_Q,
  current_agency_Q,
  product_Q,
  product_settings_Q,
  update_product_settings_M,
  useMutation,
  useQuery
} from '@duely/client';
import { Form, useFormMessages, useForm } from '@duely/react';

type ProductProps = {
  product_id?: string;
};

type UpdateProductCheckoutSettingsFormFields = {
  checkout_success_url: string;
  checkout_cancel_url: string;
};

export function UpdateProductCheckoutSettingsForm({ product_id }: ProductProps) {
  const form = useForm<UpdateProductCheckoutSettingsFormFields>();
  const { loading: productLoading } = useQuery(
    product_Q,
    { product_id: product_id! },
    { skip: !product_id }
  );

  const { data: product_settings, loading: settingsLoading } = useQuery(
    product_settings_Q,
    { product_id: product_id! },
    { skip: !product_id }
  );

  const { data: current_agency } = useQuery(current_agency_Q);

  const { data: agency_settings, loading: agencySettingsLoading } = useQuery(agency_settings_Q, {
    agency_id: current_agency!.id
  });

  const [updateSetting, stateUpdate] = useMutation(update_product_settings_M);

  const {
    infoMessage,
    setInfoMessage,
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage
  } = useFormMessages();

  const state = {
    loading: !product_id || productLoading || agencySettingsLoading || settingsLoading
  };

  const updateLoading = stateUpdate.loading;

  async function onSubmit({
    checkout_success_url,
    checkout_cancel_url
  }: UpdateProductCheckoutSettingsFormFields) {
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
      setting_id: product_settings?.id!
    });

    if (res?.success) {
      setSuccessMessage('Saved');
      return;
    } else {
      setErrorMessage(res?.message ?? 'Unable to save changes. Something went wrong.');
    }
  }

  return (
    <>
      <Form form={form} onSubmit={onSubmit} className="flex flex-col space-y-3">
        <Form.Field
          defaultValue={
            product_settings?.checkout_success_url?.replace('https://', '') ?? undefined
          }
          name="checkout_success_url"
          className="max-w-xl"
          label="Thank you page URL"
          prefix="https://"
          placeholder={agency_settings?.checkout_success_url?.replace('https://', '')}
          loading={settingsLoading}
          hint={
            <span>
              Set a thank you page URL for this product. Your customers will be redirected here
              after successful checkout.
            </span>
          }
        />

        <Form.Field
          defaultValue={product_settings?.checkout_cancel_url?.replace('https://', '') ?? undefined}
          name="checkout_cancel_url"
          className="max-w-xl"
          label="Checkout cancelled redirect URL"
          prefix="https://"
          placeholder={agency_settings?.checkout_cancel_url?.replace('https://', '')}
          loading={settingsLoading}
          hint={<span>Your customers will be redirected here after cancelled checkout.</span>}
        />

        <div className="flex flex-row items-center pt-3 space-x-4">
          <Form.Button dense>Save</Form.Button>
          <Form.Button type="reset" dense>
            Cancel
          </Form.Button>
          <Form.InfoMessage error={errorMessage} info={infoMessage} success={successMessage} />
        </div>
      </Form>
    </>
  );
}
