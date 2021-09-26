import { useImageInputFromFileList, UseFormReturn, Form } from '@duely/react';
import { useEffect } from 'react';

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
>({ form }: ProductBasicInfoFormSectionProps<TFieldValues>) {
  // image logo
  const image_logo_file_list = form.useFormFieldValue('image_logo_file_list');
  const { image: imageLogo, loading: imageLogoLoading } =
    useImageInputFromFileList(image_logo_file_list);

  // url name
  const url_name_field = form.useFormFieldState('url_name');
  const name = form.useFormFieldValue('name');

  useEffect(() => {
    if (!url_name_field.isDirty) {
      const defaultCheckoutUrl =
        name
          ?.trim()
          .toLowerCase()
          .replace(/[^\w\d-]+/g, '-') ?? '';

      form.setValue('url_name', defaultCheckoutUrl);
    }
  }, [url_name_field.isDirty, name]);

  return (
    <>
      <Form.Field
        label="Product name"
        className="max-w-xl"
        name="name"
        type="text"
        registerOptions={{ required: true }}
      />
      <Form.Field
        label="URL friendly name"
        className="max-w-xl"
        name="url_name"
        type="text"
        prefix="/products/"
        hint="How would you like the product name to appear in URLs"
        registerOptions={{ required: true }}
      />
      <Form.Field
        label="Description"
        className="max-w-xl"
        name="description"
        type="textarea"
        rows={5}
        registerOptions={{ required: true }}
      />
      <Form.Field
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
