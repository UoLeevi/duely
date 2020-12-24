import { FormField } from '@duely/react';
import { useQuery, current_subdomain_Q } from '@duely/client';
import useImage from 'hooks/useImage';

export function ServiceBasicInfoFormSection({ form }) {
  const { data: current_subdomain } = useQuery(current_subdomain_Q);

  // image logo
  const image_logo_file = form.watch('image_logo_file_list')?.[0];
  const imageLogo = useImage({ file: image_logo_file });

  // subdomain name
  if (!form.formState.dirtyFields.subdomain_name) {
    const defaultCheckoutUrl = form.watch('name')?.trim().toLowerCase().replace(/[^\w\d-]+/g, '-');
    form.setValue('url_name', defaultCheckoutUrl);
  }

  return (
    <>
      <FormField form={form} label="Service name" className="max-w-xl" name="name" type="text" validateRule={{ required: true }} />
      <FormField form={form} label="URL friendly name" className="max-w-xl" name="url_name" type="text" prefix={`${current_subdomain.name}.duely.app/`} hint="How would you like the service name to appear in URLs" validateRule={{ required: true }} />
      <FormField form={form} label="Description" className="max-w-xl" name="description" type="textarea" rows="5" validateRule={{ required: true }} />
      <FormField form={form} label="Logo image" className="max-w-xl" name="image_logo_file_list" type="image" loading={imageLogo.loading} src={imageLogo.data} accept="image/jpeg, image/png" hint="PNG, JPG up to 512KB, and minimum 128px by 128px." validateRule={{ required: true }} />
    </>
  );
}
