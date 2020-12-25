import { useForm } from 'react-hook-form';
import { FormButton, FormErrorInfo, useImageInputFromFileList } from '@duely/react';
import { useMutation, useQuery, current_subdomain_Q, create_service_M, create_price_M, update_service_M } from '@duely/client';
import { BsCheck } from 'react-icons/bs';
import { ServiceBasicInfoFormSection } from './ServiceBasicInfoFormSection';
import { ServicePricingFormSection } from './ServicePricingFormSection';
import { Link } from 'react-router-dom';
import { Currency } from '@duely/core';

export function CreateServiceForm() {
  const form = useForm({
    defaultValues: {
      payment_type: 'one_time'
    }
  });
  const [createService, stateService] = useMutation(create_service_M);
  const [createPrice, statePrice] = useMutation(create_price_M);
  const [updateService, stateUpdate] = useMutation(update_service_M);
  const { data: current_subdomain } = useQuery(current_subdomain_Q);

  const state = {
    loading: stateService.loading || statePrice.loading || stateUpdate.loading,
    error: stateService.error || statePrice.error || stateUpdate.error,
    success: stateService.data?.success && statePrice.data?.success && stateUpdate.data?.success,
  };

  // image logo
  const image_logo_file_list = form.watch('image_logo_file_list');
  const { image: image_logo } = useImageInputFromFileList(image_logo_file_list);

  async function onSubmit({ image_logo_file_list, ...data }) {
    const { name, description, url_name } = data;
    const res_service = await createService({ agency_id: current_subdomain.agency.id, name, description, url_name, image_logo, status: 'draft' });

    if (!res_service?.success) return;

    const { service } = res_service;
    const { unit_amount_hundred_cents, payment_type, frequency } = data;
    const currency = 'usd'; // TODO: have an input or use default currency
    const unit_amount = Currency.numberToMinorCurrencyAmount(+unit_amount_hundred_cents, currency);

    const recurring = {};

    if (payment_type === 'recurring') {
      const [interval_count, interval] = frequency.split(':');
      recurring.recurring_interval_count = +interval_count;
      recurring.recurring_interval = interval;
    }

    const res_price = await createPrice({ service_variant_id: service.default_variant.id, unit_amount, currency, status: 'live', ...recurring });

    if (!res_price?.success) return;

    const { price } = res_price;
    await updateService({ service_id: service.id, default_price_id: price.id, status: 'live' });
  };

  if (state.success) {
    const { service } = stateService.data;
    return (
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="grid w-12 h-12 bg-green-200 rounded-full place-items-center">
          <BsCheck className="text-3xl text-green-600" />
        </div>
        <h3 className="text-2xl font-semibold"><span className="whitespace-nowrap">{service.name}</span> <span className="whitespace-nowrap">created succesfully</span></h3>
        <Link className="px-12 py-3 mt-2 font-medium text-white bg-indigo-500 rounded-md" to="/dashboard/services">Go to services</Link>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-3">
        <ServiceBasicInfoFormSection form={form} />
        <h3 className="pt-6 pb-2 text-lg font-medium">Pricing</h3>
        <ServicePricingFormSection form={form} />
        <div className="flex flex-row items-center pt-3 space-x-8">
          <FormButton loading={state.loading}>Create service</FormButton>
          <FormErrorInfo error={state.error} />
        </div>
      </form>
    </>
  );
}
