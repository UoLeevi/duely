import { FormField, useImageInputFromFileList } from '@duely/react';
import { UseFormReturn } from 'react-hook-form';

type ProductBasicInfoFormSectionFields = {
  name: string;
  description: string;
  url_name: string;
  image_logo_file_list: FileList;
};

type ProductBasicInfoFormSectionProps<TFieldValues extends ProductBasicInfoFormSectionFields> = {
  form: UseFormReturn<TFieldValues>;
};

export function ProductBasicInfoFormSection<
  TFieldValues extends ProductBasicInfoFormSectionFields
>({ form: _form }: ProductBasicInfoFormSectionProps<TFieldValues>) {
  // TODO: fix types
  // Lets's brute force fix the type errors
  // see: https://github.com/react-hook-form/react-hook-form/discussions/3924
  const form = _form as unknown as UseFormReturn<ProductBasicInfoFormSectionFields>;

  // image logo
  const image_logo_file_list = form.watch('image_logo_file_list');
  const { image: imageLogo, loading: imageLogoLoading } = useImageInputFromFileList(
    image_logo_file_list
  );

  // url name
  if (!form.formState.dirtyFields.url_name) {
    const defaultCheckoutUrl = form
      .watch('name')
      ?.trim()
      .toLowerCase()
      .replace(/[^\w\d-]+/g, '-');
    form.setValue('url_name', defaultCheckoutUrl);
  }

  return (
    <>
      <FormField
        form={form}
        label="Product name"
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
        prefix="/products/"
        hint="How would you like the product name to appear in URLs"
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
        image={imageLogo}
        accept="image/jpeg, image/png"
        hint="PNG, JPG up to 512KB, and minimum 128px by 128px."
        registerOptions={{ required: true }}
      />
    </>
  );
}
