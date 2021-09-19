import { diff, pick } from '@duely/util';
import {
  update_theme_M,
  update_image_M,
  useMutation,
  useQuery,
  image_Q,
  current_agency_Q,
  theme_Q
} from '@duely/client';
import {
  useForm,
  Form,
  FormButton,
  FormField,
  FormInfoMessage,
  useFormMessages,
  ValidationRules,
  useImageInputFromFileList,
  Util
} from '@duely/react';

type SettingsBrandingSettingsFormValues = { image_logo_file_list: FileList };

export function SettingsBrandingSettingsForm() {
  const [updateTheme, stateUpdate] = useMutation(update_theme_M);
  const [updateImage] = useMutation(update_image_M);

  const form = useForm<SettingsBrandingSettingsFormValues>();

  const { data: agency, loading: agency_loading } = useQuery(current_agency_Q);
  const { data: theme, loading: theme_loading } = useQuery(
    theme_Q,
    { theme_id: agency?.theme?.id! },
    { skip: !agency?.theme }
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
    loading: agency_loading || stateUpdate.loading
  };

  // image logo
  const { data: current_image_logo, loading: image_logoLoading } = useQuery(
    image_Q,
    { image_id: agency?.theme.image_logo?.id! },
    { skip: !agency?.theme.image_logo }
  );
  const image_logo_file_list = form.useFormFieldValue('image_logo_file_list');
  const { image: image_logo, loading: imageLogoLoading } =
    useImageInputFromFileList(image_logo_file_list);

  const onSubmit = async ({
    image_logo_file_list,
    ...data
  }: SettingsBrandingSettingsFormValues) => {
    const update = {
      ...diff(pick(data, theme!), theme!)
    };

    let image_update_res = null;

    if (image_logo && image_logo?.data !== current_image_logo?.data) {
      image_update_res = await updateImage({ image_id: current_image_logo?.id!, ...image_logo });

      if (!image_update_res?.success) {
        setErrorMessage(
          image_update_res?.message ?? 'Unable to save changes. Something went wrong.'
        );
        return;
      }
    }

    if (Object.keys(update).length === 0) {
      if (image_update_res) {
        if (image_update_res?.success) {
          setSuccessMessage('Saved');
          return;
        }
      }

      setInfoMessage('No changes to be saved');
      form.reset();
      return;
    }

    const res = await updateTheme({ theme_id: theme?.id!, ...diff });
    if (res?.success) {
      setSuccessMessage('Saved');
      return;
    } else {
      setErrorMessage(res?.message ?? 'Unable to save changes. Something went wrong.');
    }
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
        <FormButton dense>Save</FormButton>
        <FormButton type="reset" dense>
          Cancel
        </FormButton>
        <FormInfoMessage error={errorMessage} info={infoMessage} success={successMessage} />
      </div>
    </Form>
  );
}
