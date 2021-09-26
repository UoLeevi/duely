import { image_Q, product_Q, update_product_M, useMutation, useQuery } from '@duely/client';
import {
  Form,
  useImageInputFromFileList,
  useFormMessages,
  useForm,
  ValidationRules
} from '@duely/react';

import { pick, diff } from '@duely/util';

type ProductProps = {
  product_id?: string;
};

type UpdateProductBasicInfoFormFields = {
  name: string;
  description: string | null;
  url_name: string;
  image_logo_file_list: FileList;
};

export function UpdateProductBasicInfoForm({ product_id }: ProductProps) {
  const form = useForm<UpdateProductBasicInfoFormFields>();
  const { data: product, loading: productLoading } = useQuery(
    product_Q,
    { product_id: product_id! },
    { skip: !product_id }
  );
  const [updateProduct, stateUpdate] = useMutation(update_product_M);
  const {
    infoMessage,
    setInfoMessage,
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage
  } = useFormMessages();

  const state = {
    loading: !product_id || productLoading
  };

  // image logo
  const { data: current_image_logo, loading: image_logoLoading } = useQuery(
    image_Q,
    { image_id: product?.image_logo?.id! },
    { skip: !product?.image_logo }
  );
  const image_logo_file_list = form.useFormFieldValue('image_logo_file_list');
  const { image: image_logo, loading: imageLogoLoading } =
    useImageInputFromFileList(image_logo_file_list);

  async function onSubmit({ image_logo_file_list, ...data }: UpdateProductBasicInfoFormFields) {
    const update = {
      ...diff(pick(data, product!), product!)
    };

    if (image_logo && image_logo?.data !== current_image_logo?.data) {
      update.image_logo = image_logo;
    }

    if (Object.keys(update).length === 0) {
      setInfoMessage('No changes to be saved');
      form.reset();
      return;
    }

    const res = await updateProduct({ product_id: product_id!, ...update });

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
        <Form.Field
          defaultValue={product?.name}
          label="Product name"
          className="max-w-xl"
          name="name"
          type="text"
          registerOptions={{ required: true }}
          loading={state.loading}
        />
        <Form.Field
          defaultValue={product?.url_name}
          label="URL friendly name"
          className="max-w-xl"
          name="url_name"
          type="text"
          prefix="/products/"
          hint={
            <span>
              <span>How product name should appear in URLs.</span>
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
          loading={state.loading}
        />
        <Form.Field
          defaultValue={product?.description}
          label="Description"
          className="max-w-xl"
          name="description"
          type="textarea"
          rows={5}
          registerOptions={{ required: true }}
          loading={state.loading}
        />
        <Form.Field
          label="Logo image"
          className="max-w-xl"
          name="image_logo_file_list"
          type="image"
          loading={image_logoLoading || imageLogoLoading}
          image={image_logo ?? current_image_logo}
          registerOptions={{
            rules: [ValidationRules.maxFileSize(512000)]
          }}
          accept="image/jpeg, image/png"
          hint="PNG, JPG up to 512KB, and minimum 128px by 128px."
        />

        <div className="flex flex-row items-center pt-3 space-x-4">
          <Form.Button dense>Save</Form.Button>
          <Form.Button type="reset" dense>
            Cancel
          </Form.Button>
          <Form.InfoMessage error={errorMessage} info={infoMessage} success={successMessage} />
        </div>
      </Form>
    </>
  );
}
