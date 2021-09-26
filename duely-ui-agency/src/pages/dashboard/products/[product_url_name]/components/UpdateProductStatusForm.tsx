import { product_Q, update_product_M, useMutation, useQuery } from '@duely/client';
import { Form, useFormMessages, useForm } from '@duely/react';

type ProductProps = {
  product_id?: string;
};

type UpdateProductStatusFormFields = {
  status: string;
};

export function UpdateProductStatusForm({ product_id }: ProductProps) {
  const form = useForm<UpdateProductStatusFormFields>();
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

  async function onSubmit({ status }: UpdateProductStatusFormFields) {
    if (status === product?.status) {
      setInfoMessage('No changes to be saved');
      form.reset();
      return;
    }

    const res = await updateProduct({ product_id: product_id!, status });

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
          defaultValue={product?.status}
          name="status"
          type="radio-toggle"
          options={[
            'draft',
            { value: 'live', className: 'bg-gradient-to-r from-green-400 to-green-300' }
          ]}
          loading={state.loading}
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
