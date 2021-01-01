import { service_Q, update_service_M, useMutation, useQuery } from '@duely/client';
import {
  Form,
  FormButton,
  FormField,
  FormInfoMessage,
  useImageInputFromFileList,
  useFormMessages,
  Util
} from '@duely/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

type ServiceProps = {
  service_id: string;
};

type UpdateServiceBasicInfoFormFields = {
  name: string;
  description: string;
  url_name: string;
  image_logo_file_list: FileList;
};

export function UpdateServiceBasicInfoForm({ service_id }: ServiceProps) {
  const form = useForm<UpdateServiceBasicInfoFormFields>();
  const { data: service, loading: serviceLoading } = useQuery(service_Q, { service_id });
  const [updateService, stateUpdate] = useMutation(update_service_M);
  const {
    infoMessage,
    setInfoMessage,
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage
  } = useFormMessages();

  const state = {
    loading: serviceLoading || stateUpdate.loading
  };

  // image logo
  const current_image_logo = service?.default_variant.image_logo;

  const image_logo_file_list = form.watch('image_logo_file_list');
  const { image: image_logo, loading: imageLogoLoading } = useImageInputFromFileList(
    image_logo_file_list
  );

  const reset = form.reset;

  useEffect(() => {
    if (!service) return;
    reset({
      name: service.name,
      description: service.default_variant.description ?? undefined,
      url_name: service.url_name
    });
  }, [reset, service]);

  async function onSubmit({ image_logo_file_list, ...data }: UpdateServiceBasicInfoFormFields) {
    const update = {
      ...Util.diff(Util.pick(data, service!), service!),
      ...Util.diff(Util.pick(data, service?.default_variant!), service?.default_variant!)
    };

    if (image_logo && image_logo?.data !== service?.default_variant.image_logo?.data) {
      update.image_logo = image_logo;
    }

    if (Object.keys(update).length === 0) {
      setInfoMessage('No changes to be saved');
      form.reset();
      return;
    }

    const res = await updateService({ service_id, ...update });

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
        <FormField
          form={form}
          label="Service name"
          className="max-w-xl"
          name="name"
          type="text"
          registerOptions={{ required: true }}
        />
        <FormField
          form={form}
          label="URL friendly name"
          className="max-w-xl"
          name="url_name"
          type="text"
          prefix="/services/"
          hint={
            <span>
              <span>How service name should appear in URLs.</span>
              <br />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="inline h-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">
                Note that changing the URL causes external links to break.
              </span>
            </span>
          }
          registerOptions={{ required: true }}
        />
        <FormField
          form={form}
          label="Description"
          className="max-w-xl"
          name="description"
          type="textarea"
          rows={5}
          registerOptions={{ required: true }}
        />
        <FormField
          form={form}
          label="Logo image"
          className="max-w-xl"
          name="image_logo_file_list"
          type="image"
          loading={imageLogoLoading}
          image={image_logo ?? current_image_logo}
          accept="image/jpeg, image/png"
          hint="PNG, JPG up to 512KB, and minimum 128px by 128px."
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
