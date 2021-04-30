import { useForm } from 'react-hook-form';
import { FormButton, FormInfoMessage, useImageInputFromFileList, Util } from '@duely/react';
import { useMemo, useRef } from 'react';
import { useModal } from 'hooks';
import { FormField, useDynamicNavigation } from '@duely/react';
import ServicesAgreement from 'components/ServicesAgreement';
import { useQuery, countries_Q, useMutation, create_agency_M } from '@duely/client';
import { BsCheck } from 'react-icons/bs';

type CreateBrandFormFields = {
  name: string;
  email_address: string;
  subdomain_name: string;
  country_code: string;
  image_logo_file_list: FileList;
};

type CreateBrandFormProps = {
  className?: string;
};

export default function CreateBrandForm({ className }: CreateBrandFormProps) {
  const form = useForm<CreateBrandFormFields>();
  const { watch, setValue, formState } = form;
  const [createAgency, state] = useMutation(create_agency_M);

  // countries
  const countriesQuery = useQuery(countries_Q);
  const countries = useMemo(
    () =>
      countriesQuery.data
        ?.map((c) => ({ value: c.code, element: `${c.name} ${c.flag}` }))
        ?.sort((a, b) => a.element.localeCompare(b.element)),
    [countriesQuery.data]
  );

  // image logo
  const image_logo_file_list = watch('image_logo_file_list');
  const { image: image_logo, loading: imageLogoLoading } = useImageInputFromFileList(
    image_logo_file_list
  );

  // subdomain name
  if (!formState.dirtyFields.subdomain_name) {
    const defaultSubdomainName = watch('name')
      ?.trim()
      .toLowerCase()
      .replace(/[^\w\d]+/g, '');
    setValue('subdomain_name', defaultSubdomainName);
  }

  async function onSubmit({ image_logo_file_list, ...data }: CreateBrandFormFields) {
    await createAgency({
      ...data,
      image_logo: image_logo!,
      livemode: false,
      return_url: `${window.location.origin}/profile`
    });
  }

  const hideTosRef = useRef();
  const showTosModal = useModal(<ServicesAgreement ok={hideTosRef.current} />, {
    hideModalRef: hideTosRef
  });

  const passAccessToken = useDynamicNavigation({ passAccessToken: true });

  if (state.data?.success) {
    const { agency, stripe_verification_url } = state.data;
    const dashboard_url = `https://${agency!.subdomain.name}.duely.app/dashboard`;

    return (
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="grid w-12 h-12 bg-green-200 rounded-full place-items-center">
          <BsCheck className="text-3xl text-green-600" />
        </div>
        <h3 className="text-2xl font-semibold ">
          <span className="whitespace-nowrap">{agency!.name}</span>{' '}
          <span className="whitespace-nowrap">created succesfully</span>
        </h3>
        <p className="font-medium text-gray-600">
          Next you can start setting up your products and{' '}
          <a
            href={stripe_verification_url!}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600"
          >
            verify your account on Stripe
          </a>{' '}
          to enable payments.
        </p>
        <a
          href={dashboard_url}
          onClick={passAccessToken}
          className="px-12 py-3 mt-2 font-medium text-white bg-indigo-500 rounded-md"
        >
          Go to dashboard
        </a>
      </div>
    );
  }

  className = Util.createClassName('flex flex-col space-y-3', className);

  return (
    <>
      <h2 className="self-center text-xl font-semibold text-gray-700 sm:text-2xl">
        Create your brand
      </h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        <FormField
          form={form}
          label="Brand name"
          name="name"
          type="text"
          registerOptions={{ required: true }}
        />
        <FormField
          form={form}
          label="Subdomain URL"
          name="subdomain_name"
          prefix="https://"
          suffix=".duely.app"
          hint="Choose a subdomain for your brand"
          type="text"
          registerOptions={{ required: true }}
        />
        <FormField
          form={form}
          label="Country"
          name="country_code"
          type="select"
          loading={countriesQuery.loading}
          options={countries}
          registerOptions={{ required: true }}
        />
        <FormField
          form={form}
          label="Logo image"
          name="image_logo_file_list"
          type="image"
          loading={imageLogoLoading}
          image={image_logo}
          accept="image/jpeg, image/png"
          hint="PNG, JPG up to 512KB, and minimum 128px by 128px."
          registerOptions={{ required: true }}
        />

        <div className="flex flex-col pt-4">
          <p className="text-xs text-center">
            By creating an agency on Duely, you agree to our{' '}
            <button type="button" onClick={showTosModal} className="text-indigo-600">
              Services Agreement
            </button>{' '}
            and the{' '}
            <a
              className="text-indigo-600"
              target="_blank"
              rel="noopener noreferrer"
              href="https://stripe.com/connect-account/legal"
            >
              Stripe Connected Account Agreement
            </a>
            .
          </p>
        </div>
        <div className="flex flex-col items-center pt-4">
          <FormButton form={form} spinner loading={state.loading}>
            Create a brand
          </FormButton>
        </div>
        <div className="flex flex-col items-center h-24 pt-4">
          <FormInfoMessage error={state.error} />
        </div>
      </form>
    </>
  );
}
