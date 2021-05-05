import { product_Q, update_product_M, useMutation, useQuery } from '@duely/client';
import {
  Form,
  FormButton,
  FormField,
  FormInfoMessage,
  useFormMessages} from '@duely/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

type ProductProps = {
  product_id: string;
};

type UpdateProductStatusFormFields = {
  status: string;
};

export function UpdateProductStatusForm({ product_id }: ProductProps) {
  const form = useForm<UpdateProductStatusFormFields>();
  const { data: product, loading: productLoading } = useQuery(product_Q, { product_id });
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
    loading: productLoading || stateUpdate.loading
  };

  const reset = form.reset;

  useEffect(() => {
    if (!product) return;
    reset({
      status: product.status
    });
  }, [reset, product, product?.status]);

  async function onSubmit({ status }: UpdateProductStatusFormFields) {
    if (status === product?.status) {
      setInfoMessage('No changes to be saved');
      form.reset();
      return;
    }

    const res = await updateProduct({ product_id, status });

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
          name="status"
          type="radio-toggle"
          options={[
            'draft',
            { value: 'live', className: 'bg-gradient-to-r from-green-400 to-green-300' }
          ]}
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
