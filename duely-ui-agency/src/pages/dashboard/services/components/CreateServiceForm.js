import { useForm } from 'react-hook-form';
import { FormButton, FormErrorInfo } from '@duely/react';
import { useMutation, useQuery, current_subdomain_Q, create_service_M, create_price_M, update_service_M } from '@duely/client';
import useImage from 'hooks/useImage';
import { BsCheck } from 'react-icons/bs';
import { ServiceBasicInfoFormSection } from './ServiceBasicInfoFormSection';
import { ServicePricingFormSection } from './ServicePricingFormSection';
import { Link } from 'react-router-dom';

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
  const image_logo_file = form.watch('image_logo_file_list')?.[0];
  const imageLogo = useImage(image_logo_file);

  async function onSubmit({ image_logo_file_list, ...data }) {
    const image_logo = {
      name: image_logo_file_list[0].name,
      data: imageLogo.data,
      color: imageLogo.color ?? '#FFFFFF'
    };

    const { name, description, url_name } = data;
    const res_service = await createService({ agency_id: current_subdomain.agency.id, name, description, url_name, status: 'draft' });

    if (!res_service?.success) return;

    const { service } = res_service;
    const { unit_amount_hundred_cents, payment_type, recurring_interval, recurring_interval_count } = data;
    const unit_amount = Math.round(unit_amount_hundred_cents * 100);

    const recurring = {};

    switch (payment_type) {
      case 'payment_plan':
        recurring.recurring_interval = 'month';
        recurring.recurring_interval_count = recurring_interval_count;
        break;
        
      case 'subscription':
        recurring.recurring_interval = recurring_interval;
        break;

      default:
        break;
    }

    const res_price = await createPrice({ service_variant_id: service.default_variant.id, unit_amount, currency: 'usd', status: 'live', ...recurring });

    if (!res_price?.success) return;

    const { price } = res_price;
    await updateService({ service_id: service.id, default_price_id: price.id, status: 'live' });
  };

  if (state.success) {
    const { service } = stateService.data;
    return (
      <div className="flex flex-col space-y-4 items-center text-center">
        <div className="w-12 h-12 rounded-full bg-green-200 grid place-items-center">
          <BsCheck className="text-green-600 text-3xl" />
        </div>
        <h3 className="text-2xl font-semibold"><span className="whitespace-no-wrap">{service.name}</span> <span className="whitespace-no-wrap">created succesfully</span></h3>
        <Link className="mt-2 rounded-md bg-indigo-500 text-white px-12 py-3 font-medium" to="/dashboard/services">Go to services</Link>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-3">
        <ServiceBasicInfoFormSection form={form} />
        <h3 className="text-lg font-medium pb-2 pt-6">Pricing</h3>
        <ServicePricingFormSection form={form} />
        <div className="flex flex-row space-x-8 pt-3 items-center">
          <FormButton loading={state.loading}>Create service</FormButton>
          <FormErrorInfo error={state.error} />
        </div>
      </form>
    </>
  );
}
