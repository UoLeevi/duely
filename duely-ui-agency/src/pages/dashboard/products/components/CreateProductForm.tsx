import { useImageInputFromFileList, useForm, Form, LinkButton } from '@duely/react';
import {
  useMutation,
  useQuery,
  current_subdomain_Q,
  create_product_M,
  create_price_M,
  update_product_M,
  agency_stripe_account_Q,
  current_agency_Q,
  integration_configs_Q,
  integration_type_Q,
  create_integration_M
} from '@duely/client';
import { ProductBasicInfoFormSection } from './ProductBasicInfoFormSection';
import { ProductPricingFormSection } from './ProductPricingFormSection';
import { Currency, numberToMinorCurrencyAmount, pick } from '@duely/util';
import { ProductIntegrationFormSection } from './ProductIntegrationFormSection';

type CreateProductFormFields = {
  name: string;
  description: string;
  url_name: string;
  unit_amount_major: number;
  status: 'draft' | 'live';
  payment_type: 'one_time' | 'recurring';
  image_logo_file_list: FileList;
  frequency?: string;
  integration_config_name: string;
} & Record<string, string>;

export function CreateProductForm() {
  const form = useForm<CreateProductFormFields>({
    defaultValues: {
      payment_type: 'one_time'
    }
  });
  const [createProduct, stateProduct] = useMutation(create_product_M);
  const [createPrice, statePrice] = useMutation(create_price_M);
  const [createIntegration, stateIntegration] = useMutation(create_integration_M);
  const [updateProduct, stateUpdate] = useMutation(update_product_M);
  const { data: current_subdomain } = useQuery(current_subdomain_Q);
  const { data: agency } = useQuery(current_agency_Q);
  const { data: stripe_account, loading: stripe_accountLoading } = useQuery(
    agency_stripe_account_Q,
    { agency_id: agency!.id },
    { skip: !agency }
  );

  const { data: integration_configs, loading: integration_configsLoading } = useQuery(
    integration_configs_Q,
    { filter: { agency_id: agency!.id } },
    { skip: !agency }
  );

  const integration_config_name = form.useFormFieldValue('integration_config_name');
  const integration_config = integration_configs?.find((c) => c.name === integration_config_name);

  const { data: integration_type, loading: integration_typeLoading } = useQuery(
    integration_type_Q,
    {
      integration_type_id: integration_config?.integration_type?.id!
    },
    {
      skip: !integration_config
    }
  );

  const state = {
    loading: stateProduct.loading || statePrice.loading || stateUpdate.loading,
    error: stateProduct.error || statePrice.error || stateUpdate.error,
    success: stateProduct.data?.success && statePrice.data?.success && stateUpdate.data?.success
  };

  // image logo
  const image_logo_file_list = form.useFormFieldValue('image_logo_file_list');
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
    const currency = agency?.default_pricing_currency ?? stripe_account?.default_currency ?? 'usd'; // TODO: have an input or use default currency
    const unit_amount = numberToMinorCurrencyAmount(unit_amount_major, currency as Currency);

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

    if (integration_type) {
      const integration_json = JSON.stringify(
        pick(
          data,
          integration_type.fields!.map((f) => f.name)
        )
      );

      const res_integration = await createIntegration({
        agency_id: current_subdomain!.agency.id,
        integration_config_id: integration_config!.id,
        integration_type_id: integration_type?.id,
        product_id: product!.id,
        data: integration_json
      });

      if (!res_integration?.success) return;
    }

    const { price } = res_price;
    await updateProduct({ product_id: product!.id, default_price_id: price!.id, status });
  }

  if (state.success) {
    const { product } = stateProduct.data!;
    return (
      <div className="flex flex-col items-center flex-1 space-y-4 text-center">
        <div className="grid w-12 h-12 border-2 border-green-600 rounded-full bg-gradient-to-r from-green-50 to-green-100 place-items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="text-3xl text-green-600 h-[1em] w-[1em]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              className="animate-stroke-draw"
              pathLength="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-semibold">
          <span className="whitespace-nowrap">{product!.name}</span>{' '}
          <span className="whitespace-nowrap">created succesfully</span>
        </h3>
        <LinkButton color="indigo" to="/dashboard/products">
          Go to products
        </LinkButton>
      </div>
    );
  }

  return (
    <>
      <h2 className="mb-3 text-xl font-medium">Create a product</h2>
      <Form form={form} onSubmit={onSubmit} className="flex flex-col space-y-3">
        <ProductBasicInfoFormSection form={form} />
        <h3 className="pt-6 pb-2 text-lg font-medium">Pricing</h3>
        <ProductPricingFormSection form={form} />
        <h3 className="pt-6 pb-2 text-lg font-medium">Integration</h3>
        <ProductIntegrationFormSection form={form} />
        <h3 className="pt-6 pb-2 text-lg font-medium">Status</h3>
        <Form.Field
          name="status"
          type="radio-toggle"
          options={[
            'draft',
            { value: 'live', className: 'bg-gradient-to-r from-green-400 to-green-300' }
          ]}
        />
        <div className="flex flex-row items-center pt-3 space-x-8">
          <Form.Button>Create product</Form.Button>
          <Form.InfoMessage error={state.error} />
        </div>
      </Form>
    </>
  );
}
