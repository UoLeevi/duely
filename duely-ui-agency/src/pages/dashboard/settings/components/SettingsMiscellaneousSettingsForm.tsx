import { update_agency_M, useMutation, useQuery, current_agency_extended_Q } from '@duely/client';
import { FormButton, FormField, FormInfoMessage, useFormMessages } from '@duely/react';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type SettingsMiscellaneousSettingsFormValues = { default_pricing_currency: string };

export function SettingsMiscellaneousSettingsForm() {
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
  }, [reset, current_agency, current_agency?.default_pricing_currency]);

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
        className="max-w-xs"
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
