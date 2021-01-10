import {
  agency_thank_you_page_settings_Q,
  create_product_thank_you_page_setting_M,
  current_agency_Q,
  delete_product_thank_you_page_setting_M,
  product_Q,
  product_thank_you_page_settings_Q,
  update_product_thank_you_page_setting_M,
  useMutation,
  useQuery
} from '@duely/client';
import { MutationResult } from '@duely/core';
import { Form, FormButton, FormField, FormInfoMessage, useFormMessages } from '@duely/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

type ProductProps = {
  product_id: string;
};

type UpdateProductCheckoutSettingsFormFields = { url: string };

export function UpdateProductCheckoutSettingsForm({ product_id }: ProductProps) {
  const form = useForm<UpdateProductCheckoutSettingsFormFields>();
  const { loading: productLoading } = useQuery(product_Q, { product_id });

  const {
    data: product_thank_you_page_settings,
    loading: settingsLoading
  } = useQuery(product_thank_you_page_settings_Q, { product_id });

  const { data: current_agency } = useQuery(current_agency_Q);

  const {
    data: agency_thank_you_page_settings,
    loading: agencySettingsLoading
  } = useQuery(agency_thank_you_page_settings_Q, { agency_id: current_agency!.id });

  const [createSetting, stateCreate] = useMutation(create_product_thank_you_page_setting_M);
  const [updateSetting, stateUpdate] = useMutation(update_product_thank_you_page_setting_M);
  const [deleteSetting, stateDelete] = useMutation(delete_product_thank_you_page_setting_M);

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
      productLoading ||
      agencySettingsLoading ||
      settingsLoading ||
      stateUpdate.loading ||
      stateCreate.loading ||
      stateDelete.loading
  };

  const reset = form.reset;

  useEffect(() => {
    if (!product_thank_you_page_settings) return;
    reset({
      url: product_thank_you_page_settings?.url?.replace('https://', '')
    });
  }, [reset, product_thank_you_page_settings]);

  async function onSubmit({ url }: UpdateProductCheckoutSettingsFormFields) {
    url = url.trim();

    if (url === '') {
      if (product_thank_you_page_settings == null) {
        return;
      } else {
        await deleteSetting({ setting_id: product_thank_you_page_settings.id });
      }
    } else {
      url = `https://${url}`;

      if (url === agency_thank_you_page_settings?.url) {
        setInfoMessage('No changes to be saved');
        form.reset();
        return;
      }

      let res: MutationResult | null | undefined;

      if (product_thank_you_page_settings == null) {
        res = await createSetting({ url, product_id });
      } else {
        res = await updateSetting({ url, setting_id: product_thank_you_page_settings.id });
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
              Set a thank you page URL for this product. Your customers will be redirected here
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
