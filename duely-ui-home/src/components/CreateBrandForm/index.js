import { useForm } from 'react-hook-form';
import { FormButton, FormErrorInfo, Util } from '@duely/react';
import { useMemo, useRef } from 'react';
import { useModal } from 'hooks';
import { FormField } from '@duely/react';
import ServicesAgreement from 'components/ServicesAgreement';
import { useQuery, country_codes_Q, useMutation, create_agency_M } from '@duely/client';
import { Image } from 'components/Image';
import useImage from 'hooks/useImage';
import { BsCheck } from 'react-icons/bs';

export default function CreateBrandForm() {
  const form = useForm();
  const { watch, setValue, formState } = form;
  const [createAgency, state] = useMutation(create_agency_M);

  // country codes
  const countryCodesQ = useQuery(country_codes_Q);
  const countries = useMemo(() => countryCodesQ.data
    ?.map(Util.countryByCode)
    .sort((a, b) => (a.name).localeCompare(b.name))
    .map(c => ({ value: c.alpha2code, element: c.shortName || c.name ? `${c.shortName || c.name} ${c.flag}` : c.alpha2code })),
    [countryCodesQ.data]);

  // image logo
  const image_logo_file = watch('image_logo_file_list')?.[0];
  const imageLogo = useImage(image_logo_file);

  // subdomain name
  if (!formState.dirtyFields.subdomain_name) {
    const defaultSubdomainName = watch('name')?.trim().toLowerCase().replace(/[^\w\d]+/g, '');
    setValue('subdomain_name', defaultSubdomainName);
  }

  async function onSubmit({ image_logo_file_list, ...data }) {
    const image_logo = {
      name: image_logo_file_list[0].name,
      data: imageLogo.data,
      color: imageLogo.color ?? '#FFFFFF'
    };

    await createAgency({ ...data, image_logo, return_url: 'https://duely.app/profile' });
  };

  const hideTosRef = useRef();
  const showTosModal = useModal(
    <ServicesAgreement ok={hideTosRef.current} />,
    { hideModalRef: hideTosRef }
  );

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
      <h2 className="font-semibold text-xl sm:text-2xl text-gray-700 self-center">Create your brand</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-3">
        <FormField form={form} label="Brand name" name="name" type="text" validateRule={{ required: true }} />
        <FormField form={form} label="Subdomain URL" name="subdomain_name" prefix="https://" suffix=".duely.app" hint="Choose a subdomain for your brand" type="text" validateRule={{ required: true }} />
        <FormField form={form} label="Country" name="country_code" type="select" loading={countryCodesQ.loading} options={countries} validateRule={{ required: true }} />
        <FormField form={form} label="Logo image" name="image_logo_file_list" type="file" accept="image/jpeg, image/png" hint="PNG, JPG up to 512kb, and minimum 128px by 128px." validateRule={{ required: true }} />
        <Image className="h-32 border rounded-md shadow-sm" src={imageLogo.data} loading={imageLogo.loading} htmlFor="image_logo_file_list" />

        <div className="flex flex-col pt-4">
          <p className="text-xs text-center">
            By creating an agency on Duely, you agree to our <button type="button" onClick={showTosModal} className="text-indigo-600" >Services Agreement</button> and the <a className="text-indigo-600" target="_blank" rel="noopener noreferrer" href="https://stripe.com/connect-account/legal">Stripe Connected Account Agreement</a>.
        </p>
        </div>
        <div className="flex flex-col pt-4 items-center">
          <FormButton loading={state.loading}>Create a brand</FormButton>
        </div>
        <div className="flex flex-col pt-4 items-center h-24">
          <FormErrorInfo error={state.error} />
        </div>
      </form>
    </>
  );
}
