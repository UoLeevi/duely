import { useForm } from 'react-hook-form';
import { FormButton, FormErrorInfo } from '@duely/react';
import { useMutation, create_agency_M } from '@duely/client';
import useImage from 'hooks/useImage';
import { BsCheck } from 'react-icons/bs';
import { ServiceBasicInfoFormSection } from './ServiceBasicInfoFormSection';
import { ServicePricingFormSection } from './ServicePricingFormSection';

export function CreateServiceForm() {
  const form = useForm({
    defaultValues: {
      payment_type: 'one_time'
    }
  });
  const { watch, setValue, formState } = form;
  const [createAgency, state] = useMutation(create_agency_M);

  // image logo
  const image_logo_file = watch('image_logo_file_list')?.[0];
  const imageLogo = useImage(image_logo_file);

  async function onSubmit({ image_logo_file_list, ...data }) {
    const image_logo = {
      name: image_logo_file_list[0].name,
      data: imageLogo.data,
      color: imageLogo.color ?? '#FFFFFF'
    };

    // await createAgency({ ...data, image_logo, return_url: 'https://duely.app/profile' });
  };

  if (state.data?.success) {
    const { agency, stripe_verification_url } = state.data;
    return (
      <div className="flex flex-col space-y-4 items-center text-center">
        <div className="w-12 h-12 rounded-full bg-green-200 grid place-items-center">
          <BsCheck className="text-green-600 text-3xl" />
        </div>
        <h3 className="text-2xl font-semibold"><span className="whitespace-no-wrap">{agency.name}</span> <span className="whitespace-no-wrap">created succesfully</span></h3>
        <p className="text-gray-600 font-medium">
          Next you can start setting up your services and <a href={stripe_verification_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600">verify your account on Stripe</a> to enable payments.
        </p>
        <a href={`https://${agency.subdomain.name}.duely.app/dashboard`}><button className="mt-2 rounded-md bg-indigo-500 text-white px-12 py-3 font-medium">Go to dashboard</button></a>
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
