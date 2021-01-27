import { useForm } from 'react-hook-form';
import { FormButton, FormInfoMessage, FormField, useImageInputFromFileList } from '@duely/react';
import {
  useMutation,
  useQuery,
  current_subdomain_Q,
  create_product_M,
  create_price_M,
  update_product_M,
  agency_stripe_account_Q,
  current_agency_Q
} from '@duely/client';
import { BsCheck } from 'react-icons/bs';
import { ProductBasicInfoFormSection } from './ProductBasicInfoFormSection';
import { ProductPricingFormSection } from './ProductPricingFormSection';
import { Link } from 'react-router-dom';
import { Currency } from '@duely/core';

type CreateProductFormFields = {
  name: string;
  description: string;
  url_name: string;
  unit_amount_major: string;
  status: 'draft' | 'live';
  payment_type: 'one_time' | 'recurring';
  image_logo_file_list: FileList;
  frequency?: string;
};

export function CreateProductForm() {
  const form = useForm<CreateProductFormFields>({
    defaultValues: {
      payment_type: 'one_time'
    }
  });
  const [createProduct, stateProduct] = useMutation(create_product_M);
  const [createPrice, statePrice] = useMutation(create_price_M);
  const [updateProduct, stateUpdate] = useMutation(update_product_M);
  const { data: current_subdomain } = useQuery(current_subdomain_Q);
  const { data: agency } = useQuery(current_agency_Q);
  const { data: stripe_account, loading: stripe_accountLoading } = useQuery(
    agency_stripe_account_Q,
    { agency_id: agency!.id },
    { skip: !agency }
  );

  const state = {
    loading: stateProduct.loading || statePrice.loading || stateUpdate.loading,
    error: stateProduct.error || statePrice.error || stateUpdate.error,
    success: stateProduct.data?.success && statePrice.data?.success && stateUpdate.data?.success
  };

  // image logo
  const image_logo_file_list = form.watch('image_logo_file_list');
  const { image: image_logo } = useImageInputFromFileList(image_logo_file_list);

  async function onSubmit({ image_logo_file_list, ...data }: CreateProductFormFields) {
    const { name, description, url_name, status } = data;

    const res_product = await createProduct({
      agency_id: current_subdomain!.agency.id,
      name,
      description,
      url_name,
      image_logo,
      status: 'draft'
    });

    if (!res_product?.success) return;

    const { product } = res_product;
    const { unit_amount_major, payment_type, frequency } = data;
    const currency = stripe_account?.default_currency ?? 'usd'; // TODO: have an input or use default currency
    const unit_amount = Currency.numberToMinorCurrencyAmount(
      +unit_amount_major,
      currency as Currency
    );

    const recurring: {
      recurring_interval_count?: number;
      recurring_interval?: 'week' | 'month' | 'year';
    } = {};

    if (payment_type === 'recurring') {
      const [interval_count, interval] = frequency!.split(':');
      recurring.recurring_interval_count = +interval_count;
      recurring.recurring_interval = interval as typeof recurring.recurring_interval;
    }

    const res_price = await createPrice({
      product_id: product!.id,
      unit_amount,
      currency,
      status: 'live',
      ...recurring
    });

    if (!res_price?.success) return;

    const { price } = res_price;
    await updateProduct({ product_id: product!.id, default_price_id: price!.id, status });
  }

  if (state.success) {
    const { product } = stateProduct.data!;
    return (
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="grid w-12 h-12 bg-green-200 rounded-full place-items-center">
          <BsCheck className="text-3xl text-green-600" />
        </div>
        <h3 className="text-2xl font-semibold">
          <span className="whitespace-nowrap">{product!.name}</span>{' '}
          <span className="whitespace-nowrap">created succesfully</span>
        </h3>
        <Link
          className="px-12 py-3 mt-2 font-medium text-white bg-indigo-500 rounded-md"
          to="/dashboard/products"
        >
          Go to products
        </Link>
      </div>
    );
  }

  return (
    <>
      <h2 className="mb-3 text-xl font-medium">Create a product</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-3">
        <ProductBasicInfoFormSection form={form} />
        <h3 className="pt-6 pb-2 text-lg font-medium">Pricing</h3>
        <ProductPricingFormSection form={form} />
        <h3 className="pt-6 pb-2 text-lg font-medium">Status</h3>
        <FormField
          form={form}
          name="status"
          type="radio-toggle"
          options={[
            'draft',
            { value: 'live', className: 'bg-gradient-to-r from-green-400 to-green-300' }
          ]}
        />
        <div className="flex flex-row items-center pt-3 space-x-8">
          <FormButton form={form} spinner loading={state.loading}>
            Create product
          </FormButton>
          <FormInfoMessage error={state.error} />
        </div>
      </form>
    </>
  );
}
