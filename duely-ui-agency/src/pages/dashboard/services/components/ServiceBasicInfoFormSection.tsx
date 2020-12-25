import { useQuery, current_subdomain_Q } from '@duely/client';
import { FormField, useImageInputFromFileList } from '@duely/react';
import type { UseFormMethods } from 'react-hook-form';

type ServiceBasicInfoFormSectionProps = {
  form: UseFormMethods<Record<string, any>>
}

export function ServiceBasicInfoFormSection({ form }: ServiceBasicInfoFormSectionProps) {
  const { data: current_subdomain } = useQuery(current_subdomain_Q);

  // image logo
  const image_logo_file_list = form.watch('image_logo_file_list');
  const { image: imageLogo, loading: imageLogoLoading } = useImageInputFromFileList(image_logo_file_list);

  // subdomain name
  if (!form.formState.dirtyFields.subdomain_name) {
    const defaultCheckoutUrl = form.watch('name')?.trim().toLowerCase().replace(/[^\w\d-]+/g, '-');
    form.setValue('url_name', defaultCheckoutUrl);
  }

  return (
    <>
      <FormField form={form} label="Service name" className="max-w-xl" name="name" type="text" registerOptions={{ required: true }} />
      <FormField form={form} label="URL friendly name" className="max-w-xl" name="url_name" type="text" prefix={`${current_subdomain?.name}.duely.app/`} hint="How would you like the service name to appear in URLs" registerOptions={{ required: true }} />
      <FormField form={form} label="Description" className="max-w-xl" name="description" type="textarea" rows={5} registerOptions={{ required: true }} />
      <FormField form={form} label="Logo image" className="max-w-xl" name="image_logo_file_list" type="image" loading={imageLogoLoading} image={imageLogo} accept="image/jpeg, image/png" hint="PNG, JPG up to 512KB, and minimum 128px by 128px." registerOptions={{ required: true }} />
    </>
  );
}
