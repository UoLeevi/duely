import { atom, useAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import { produce } from 'immer';
import { mutate, query } from 'apollo';
import FormField from 'components/form-fields/FormField';
import { countryByCode } from 'utils';
import { useRef } from 'react';
import { useModal } from 'hooks';

const createBrandFormAtom = atom({
  loading: false,
  errorMessage: null,
  completed: false
});

const countriesAtom = atom(
  async () => {
    const countryCodes = await query('country_codes');
    return countryCodes
      .map(countryByCode)
      .sort((a, b) => (a.name).localeCompare(b.name))
      .map(c => ({ value: c.alpha2code, element: c.shortName || c.name ? `${c.shortName || c.name} ${c.flag}` : c.alpha2code }));
  }
);

export default function CreateBrandForm() {
  const form = useForm();
  const { watch } = form;
  const [createBrandForm, setCreateBrandFormState] = useAtom(createBrandFormAtom);
  const [countries] = useAtom(countriesAtom);

  const image_logo_file = watch('image_logo_file');
  console.log(image_logo_file);

  async function onSubmit(data) {
    setCreateBrandFormState({ loading: true, errorMessage: null, completedMessage: null, submitted: Date.now() });
    const res = await mutate('create_agency', { ...data, redirect_url: 'https://duely.app/profile' });

    if (res.success) {
      setCreateBrandFormState(state => produce(state, state => {
        state.loading = false;
        state.errorMessage = null;
        state.completed = true;
      }));
    } else {
      setCreateBrandFormState(state => produce(state, state => {
        state.loading = false;
        state.errorMessage = res.message;
        state.completed = false;
      }));
    }
  };

  const hideTosRef = useRef();
  const showTosModal = useModal(
    <div className="max-w-screen-xs prose prose-sm sm:prose lg:prose-lg">
      <h3>Service Agreement</h3>
      <p>Payment processing services for agencies on duely are provided by Stripe and are subject to the <a target="_blank" rel="noopener noreferrer" href="https://stripe.com/connect-account/legal">Stripe Connected Account Agreement</a>, which includes the <a target="_blank" rel="noopener noreferrer" href="https://stripe.com/legal">Stripe Terms of Service</a> (collectively, the “Stripe Services Agreement”). By agreeing to this agreement or continuing to operate as a agency on duely, you agree to be bound by the Stripe Services Agreement, as the same may be modified by Stripe from time to time. As a condition of duely enabling payment processing services through Stripe, you agree to provide duely accurate and complete information about you and your business, and you authorize duely to share it and transaction information related to your use of the payment processing services provided by Stripe.</p>
      <div className="flex justify-center">
        <button className="bg-gray-100 shadow-sm px-10 py-2 rounded-md text-md font-medium leading-5 transition duration-150 ease-in-out border border-gray-300 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50" type="button" onClick={() => hideTosRef.current()}>OK</button>
      </div>
    </div>,
    { hideModalRef: hideTosRef }
  );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-2">
      <FormField form={form} label="Brand name" name="name" type="text" validateRule={{ required: true }} />
      <FormField form={form} label="Subdomain name" name="subdomain_name" type="text" validateRule={{ required: true }} />
      <FormField form={form} label="Country" name="country_code" type="select" options={countries} validateRule={{ required: true }} />
      <FormField form={form} label="Logo image" name="image_logo.file" type="file" accept="image/*" validateRule={{ required: true }} />

      <div className="flex flex-col">
        <p className="text-xs text-center">
          By creating an agency on duely, you agree to our <button type="button" onClick={showTosModal} className="text-indigo-600" >Services Agreement</button> and the <a className="text-indigo-600" target="_blank" rel="noopener noreferrer" href="https://stripe.com/connect-account/legal">Stripe Connected Account Agreement</a>.
        </p>
      </div>
      <div className="flex flex-col pt-4 items-center">
        {!createBrandForm.loading && !createBrandForm.completed && (
          <button type="submit" className="bg-indigo-500 px-8 py-3 rounded-md text-md font-medium leading-5 text-white transition duration-150 ease-in-out border border-gray-300 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50" >
            Continue
          </button>)}
      </div>
    </form>
  );
}
