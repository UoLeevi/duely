import { update_agency_M, useMutation, useQuery, current_agency_extended_Q } from '@duely/client';
import { useForm, Form, useFormMessages } from '@duely/react';

type SettingsMiscellaneousSettingsFormValues = { default_pricing_currency: string };

export function SettingsMiscellaneousSettingsForm() {
  const [updateAgency, stateUpdate] = useMutation(update_agency_M);

  const form = useForm<SettingsMiscellaneousSettingsFormValues>();

  const { data: current_agency, loading: current_agency_loading } =
    useQuery(current_agency_extended_Q);

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

  const onSubmit = async ({
    default_pricing_currency
  }: SettingsMiscellaneousSettingsFormValues) => {
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
    <Form form={form} onSubmit={onSubmit} className="flex flex-col space-y-3">
      <Form.Field
        defaultValue={current_agency?.default_pricing_currency ?? undefined}
        name="default_pricing_currency"
        label="Pricing currency"
        type="select"
        className="max-w-xs"
        options={currencies}
        loading={current_agency_loading}
        hint={<span>Default currency for newly created products.</span>}
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
