import {
  useImageInputFromFileList,
  useForm,
  useDynamicNavigation,
  Form,
  AnchorButton,
  Modal,
  useModal
} from '@duely/react';
import { useEffect, useMemo } from 'react';
import ServicesAgreement from '~/components/ServicesAgreement';
import { useQuery, countries_Q, useMutation, create_agency_M } from '@duely/client';
import { createClassName } from '@duely/util';

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
  const modal = useModal(false);

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

  const image_logo_file_list = form.useFormFieldValue('image_logo_file_list');
  const name = form.useFormFieldValue('name');
  const subdomain_name_field = form.useFormFieldState('subdomain_name');

  // image logo
  const { image: image_logo, loading: imageLogoLoading } =
    useImageInputFromFileList(image_logo_file_list);

  // subdomain name
  useEffect(() => {
    if (!subdomain_name_field.isDirty) {
      const defaultSubdomainName = name
        ?.trim()
        .toLowerCase()
        .replace(/[^\w\d]+/g, '');
      form.setValue('subdomain_name', defaultSubdomainName ?? '');
    }
  }, [subdomain_name_field.isDirty, name]);

  async function onSubmit({ image_logo_file_list, ...data }: CreateBrandFormFields) {
    await createAgency({
      ...data,
      image_logo: image_logo!,
      livemode: true,
      return_url: `${window.location.origin}/profile`
    });
  }

  const passAccessToken = useDynamicNavigation({ passAccessToken: true });

  if (state.data?.success) {
    const { agency, stripe_verification_url } = state.data;
    const dashboard_url = `https://${agency!.subdomain.name}.duely.app/dashboard`;

    return (
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="grid w-12 h-12 bg-green-100 border-2 border-green-600 rounded-full place-items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-[1em] w-[1em] text-3xl text-green-600 animate-stroke-draw"
            pathLength="1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
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
        <AnchorButton href={dashboard_url} onClick={passAccessToken} color="indigo">
          Go to dashboard
        </AnchorButton>
      </div>
    );
  }

  className = createClassName('flex flex-col space-y-3', className);

  return (
    <>
      <h2 className="self-center text-xl font-semibold text-gray-700 sm:text-2xl">
        Create your brand
      </h2>
      <Form form={form} onSubmit={onSubmit} className={className}>
        <Form.Field
          label="Brand name"
          name="name"
          type="text"
          registerOptions={{ required: true }}
        />
        <Form.Field
          label="Subdomain URL"
          name="subdomain_name"
          prefix="https://"
          suffix=".duely.app"
          hint="Choose a subdomain for your brand"
          type="text"
          registerOptions={{ required: true }}
        />
        <Form.Field
          label="Country"
          name="country_code"
          type="select"
          loading={countriesQuery.loading}
          options={countries}
          registerOptions={{ required: true }}
        />
        <Form.Field
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
            <button type="button" onClick={modal.open} className="text-indigo-600">
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
          <Form.Button>Create a brand</Form.Button>
        </div>
        <div className="flex flex-col items-center h-24 pt-4">
          <Form.InfoMessage error={state.error} />
        </div>
      </Form>

      <Modal control={modal}>
        <ServicesAgreement ok={modal.close} />
      </Modal>
    </>
  );
}
