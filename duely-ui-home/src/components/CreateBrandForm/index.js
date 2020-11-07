import { useForm } from 'react-hook-form';
import { FormButton, FormErrorInfo, Util } from '@duely/react';
import { useMemo, useRef } from 'react';
import { useModal } from 'hooks';
import { FormField } from '@duely/react';
import ServicesAgreement from 'components/ServicesAgreement';
import { useQuery, country_codes_Q, useMutation, create_agency_M } from '@duely/client';
import { Image } from 'components/Image';
import useImage from 'hooks/useImage';

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
  const image_logo_file = watch('image_logo_file')?.[0];
  const imageLogo = useImage(image_logo_file);

  // subdomain name
  if (!formState.dirtyFields.subdomain_name) {
    const defaultSubdomainName = watch('name')?.trim().toLowerCase().replace(/[^\w\d]+/g, '');
    setValue('subdomain_name', defaultSubdomainName);
  }

  async function onSubmit({ image_logo_file, ...data }) {
    await createAgency({ ...data, return_url: 'https://duely.app/profile' });
    // todo: save image
  };

  const hideTosRef = useRef();
  const showTosModal = useModal(
    <ServicesAgreement ok={hideTosRef.current} />,
    { hideModalRef: hideTosRef }
  );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-3">
      <FormField form={form} label="Brand name" name="name" type="text" validateRule={{ required: true }} />
      <FormField form={form} label="Subdomain URL" name="subdomain_name" prefix="https://" suffix=".duely.app" hint="Choose a subdomain for your brand" type="text" validateRule={{ required: true }} />
      <FormField form={form} label="Country" name="country_code" type="select" loading={countryCodesQ.loading} options={countries} validateRule={{ required: true }} />
      <FormField form={form} label="Logo image" name="image_logo_file" type="file" accept="image/jpeg, image/png" hint="PNG, JPG up to 512kb, and minimum 128px by 128px." validateRule={{ required: true }} />
      <Image className="h-32 border rounded-md shadow-sm" src={imageLogo.data} loading={imageLogo.loading} htmlFor="image_logo_file" />

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
  );
}
