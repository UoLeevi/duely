import { update_agency_M, useMutation, useQuery, current_agency_extended_Q, image_Q } from '@duely/client';
import { useForm, Form, FormButton, FormField, FormInfoMessage, useFormMessages, ValidationRules, useImageInputFromFileList } from '@duely/react';

type SettingsBrandingSettingsFormValues = { image_logo_file_list: FileList };

export function SettingsBrandingSettingsForm() {
  const [updateAgency, stateUpdate] = useMutation(update_agency_M);

  const form = useForm<SettingsBrandingSettingsFormValues>();

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

    // image logo
    const { data: current_image_logo, loading: image_logoLoading } = useQuery(
      image_Q,
      { image_id: current_agency?.theme.image_logo?.id! },
      { skip: !current_agency?.theme.image_logo }
    );
    const image_logo_file_list = form.useFormFieldValue('image_logo_file_list');
    const { image: image_logo, loading: imageLogoLoading } =
      useImageInputFromFileList(image_logo_file_list);

  const onSubmit = async ({
    image_logo_file_list
  }: SettingsBrandingSettingsFormValues) => {
    // const res = await updateAgency({ agency_id: current_agency!.id, default_pricing_currency });

    // if (res?.success) {
    //   setSuccessMessage('Saved');
    //   return;
    // } else {
    //   setErrorMessage(res?.message ?? 'Unable to save changes. Something went wrong.');
    // }
  };

  return (
    <Form form={form} onSubmit={onSubmit} className="flex flex-col space-y-3">
        <FormField
          label="Logo image"
          className="max-w-xl"
          name="image_logo_file_list"
          type="image"
          contain
          loading={image_logoLoading || imageLogoLoading}
          image={image_logo ?? current_image_logo}
          registerOptions={{
            rules: [ValidationRules.maxFileSize(512000)]
          }}
          accept="image/jpeg, image/png"
          hint="PNG, JPG up to 512KB, and minimum 128px by 128px."
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
