import { Link } from 'react-router-dom';
import { atom, useAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import { produce } from 'immer';
import { mutate, query } from 'apollo';
import FormField from 'components/form-fields/FormField';
import { countryByCode } from 'utils';

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
  const { register, errors, watch } = form;
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

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-2">
      <FormField form={form} label="Brand name" name="name" type="text" validateRule={{ required: true }} />
      <FormField form={form} label="Subdomain name" name="subdomain_name" type="text" validateRule={{ required: true }} />
      <FormField form={form} label="Country" name="country_code" type="select" options={countries} validateRule={{ required: true }} />

      <div className="flex flex-col">
        <label className="text-label" htmlFor="image_logo_file">
          Logo image
        </label>
        <input name="image_logo_file" ref={register({ required: true })} type="file" className="input-text-base" accept="image/*" />
        <p className="text-red-500 text-xs italic h-4">{ errors.image_logo_file && <span>Please choose a logo image.</span> }</p>
      </div>
      <div className="flex flex-col">
        <p className="text-xs text-center">
          By creating an agency on duely, you agree to our <Link to="/service-agreement" className="text-indigo-600" >Services Agreement</Link> and the <a className="text-indigo-600" target="_blank" rel="noopener noreferrer" href="https://stripe.com/connect-account/legal">Stripe Connected Account Agreement</a>.
        </p>
      </div>
      <div className="flex flex-col pt-4 items-center">
        { !createBrandForm.loading && !createBrandForm.completed && (
        <button type="submit" className="bg-indigo-500 px-8 py-3 rounded-md text-md font-medium leading-5 text-white transition duration-150 ease-in-out border border-gray-300 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50" >
          Continue
        </button> )}
      </div>
    </form>
  );
}
